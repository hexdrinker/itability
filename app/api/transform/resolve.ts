export function detectLang(text: string): 'ko' | 'en' {
  return /[\uAC00-\uD7A3]/.test(text) ? 'ko' : 'en'
}

async function searchWithTavily(query: string): Promise<string | null> {
  const start = Date.now()
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: 'basic',
      max_results: 2,
      include_answer: false,
      include_raw_content: false,
    }),
  })
  const elapsed = Date.now() - start
  if (!res.ok) {
    console.error(`[Tavily] query="${query}" error=${res.status} (${elapsed}ms)`)
    return null
  }
  const data = await res.json()
  const snippets = (data.results as { content: string }[])
    ?.slice(0, 2)
    .map((r) => r.content.slice(0, 200))
    .join(' ')
  console.log(`[Tavily] query="${query}" snippets="${snippets?.slice(0, 100)}" (${elapsed}ms)`)
  return snippets ?? null
}

async function verifyWithContext(
  job: string,
  tavilyContext: string,
  lang: 'ko' | 'en',
): Promise<string | null> {
  const prompt =
    lang === 'ko'
      ? `다음 검색 결과를 참고해서 "${job}"이 실존하는 특정 인물의 확실한 별명·풍자 표현인지, 아니면 실명이거나 불확실한지 판단해.

검색 결과:
${tavilyContext}

- "${job}"이 위 검색 결과에서 특정 인물의 별명으로 명확히 확인되면: "YES: 누구의 별명이고 어떤 맥락인지 한 줄 설명"
- 실명이거나 별명으로 확인되지 않으면: "REAL_NAME"만 출력`
      : `Based on the following search results, determine if "${job}" is a confirmed nickname/satire term for a specific real person, or if it's an actual real name / unconfirmed.

Search results:
${tavilyContext}

- If "${job}" is clearly confirmed as a nickname for a specific person in the results: respond "YES: <one-line explanation>"
- If it's a real name or not confirmed as a nickname: respond with just "REAL_NAME"`

  const start = Date.now()
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const elapsed = Date.now() - start
  if (!res.ok) {
    console.error(`[Verify] input="${job}" error=${res.status} (${elapsed}ms)`)
    return 'REAL_NAME'
  }
  const data = await res.json()
  const text = (data.content?.[0]?.text ?? '').trim()

  if (/^REAL_NAME$/i.test(text)) {
    console.log(`[Verify] input="${job}" result=REAL_NAME (${elapsed}ms)`)
    return 'REAL_NAME'
  }

  const context = text.startsWith('YES:') ? text.slice(4).trim() : text
  console.log(`[Verify] input="${job}" result=YES context="${context}" (${elapsed}ms)`)
  return context
}

export async function resolveNicknameContext(
  job: string,
  lang: 'ko' | 'en',
): Promise<string | null> {
  const prompt =
    lang === 'ko'
      ? `"${job}"을 다음 기준으로 분류해.
- 실존 인물의 실명(본명)으로 판단되면: "REAL_NAME"만 출력
- 실존 인물의 별명·풍자·팬덤 표현이거나 지지자·팬덤을 가리키는 표현이고 확실히 알면: "YES: 누구를 가리키는지와 어떤 맥락인지 한 줄 설명" 형식으로 출력
- 별명인지 실명인지 잘 모르면: "SEARCH"만 출력
- 일반 직업·활동·상태면: "NO"만 출력`
      : `Classify "${job}" by the following criteria:
- If it appears to be a real person's actual name (not a nickname): respond with just "REAL_NAME"
- If it's a nickname, satire, or fandom term for a real person and you know for sure: respond "YES: <one-line explanation>"
- If unsure whether it's a name or nickname: respond with just "SEARCH"
- If it's a regular job, activity, or state: respond with just "NO"`

  const start = Date.now()
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  })
  const elapsed = Date.now() - start
  if (!res.ok) {
    console.error(`[Nickname] input="${job}" error=${res.status} (${elapsed}ms)`)
    return null
  }
  const data = await res.json()
  const text = (data.content?.[0]?.text ?? '').trim()

  if (/^NO$/i.test(text)) {
    console.log(`[Nickname] input="${job}" result=NO (${elapsed}ms)`)
    return null
  }

  if (/^REAL_NAME$/i.test(text)) {
    console.log(`[Nickname] input="${job}" result=REAL_NAME → INVALID (${elapsed}ms)`)
    return 'REAL_NAME'
  }

  if (/^SEARCH$/i.test(text)) {
    console.log(`[Nickname] input="${job}" result=SEARCH → Tavily 호출 (${elapsed}ms)`)
    const query = lang === 'ko' ? `"${job}" 뜻 인물 별명` : `"${job}" meaning person nickname`
    const tavilyResult = await searchWithTavily(query)
    console.log(`[Nickname] input="${job}" tavilyContext="${tavilyResult?.slice(0, 100) ?? 'N/A'}"`)
    if (!tavilyResult) return 'REAL_NAME'
    return await verifyWithContext(job, tavilyResult, lang)
  }

  const context = text.startsWith('YES:') ? text.slice(4).trim() : text
  console.log(`[Nickname] input="${job}" result=YES context="${context}" (${elapsed}ms)`)
  return context
}
