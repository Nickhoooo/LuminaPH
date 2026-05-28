import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Generating lessons for:", body.subject_title);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert teacher for Filipino students. Always respond with valid JSON only, no markdown, no explanation.",
        },
        {
          role: "user",
          content: `Generate 5 lessons for this subject:
            - Subject: ${body.subject_title}
            - Description: ${body.subject_description}
            - Difficulty: ${body.difficulty_level}
            
            Return ONLY a valid JSON array like this:
            [
              {
                "title": "Lesson Title",
                "content": "Detailed lesson content here — at least 3 paragraphs"
              }
            ]`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const response = completion.choices[0].message.content;
    console.log("Groq lessons response:", response);

    const cleaned = response.replace(/```json|```/g, "").trim();
    const lessons = JSON.parse(cleaned);

    return NextResponse.json({ lessons });

  } catch (error) {
    console.error("API Error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}