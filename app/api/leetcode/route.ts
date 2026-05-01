import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return Response.json({ error: 'Username required' }, { status: 400 });
  }

  try {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            ranking
            reputation
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
          userCalendar {
            submissionCalendar
            totalActiveDays
          }
        }
        allQuestionsCount {
          difficulty
          count
        }
      }
    `;

    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Referer': 'https://leetcode.com' },
      body: JSON.stringify({ query, variables: { username } }),
    });

    const json = await res.json();
    const user = json?.data?.matchedUser;
    const allQuestions = json?.data?.allQuestionsCount;

    if (!user) {
      return Response.json({ totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0, ranking: 0, totalQuestions: 0, submissionCalendar: '{}', totalActiveDays: 0 });
    }

    const stats = user.submitStatsGlobal?.acSubmissionNum || [];
    const totalQuestions = allQuestions?.find((q: { difficulty: string }) => q.difficulty === 'All')?.count || 0;

    const result = {
      totalSolved: stats.find((s: { difficulty: string }) => s.difficulty === 'All')?.count || 0,
      easySolved: stats.find((s: { difficulty: string }) => s.difficulty === 'Easy')?.count || 0,
      mediumSolved: stats.find((s: { difficulty: string }) => s.difficulty === 'Medium')?.count || 0,
      hardSolved: stats.find((s: { difficulty: string }) => s.difficulty === 'Hard')?.count || 0,
      ranking: user.profile?.ranking || 0,
      totalQuestions,
      reputation: user.profile?.reputation || 0,
      submissionCalendar: user.userCalendar?.submissionCalendar || '{}',
      totalActiveDays: user.userCalendar?.totalActiveDays || 0,
    };

    return Response.json(result);
  } catch (error) {
    console.error('LeetCode API error:', error);
    return Response.json({ totalSolved: 0, easySolved: 0, mediumSolved: 0, hardSolved: 0, ranking: 0, totalQuestions: 0, submissionCalendar: '{}', totalActiveDays: 0 });
  }
}
