import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Generating quiz for:", body.lesson_title);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert teacher for Filipino students. Always respond with valid JSON only, no markdown, no explanation.",
        },
        {
          role: "user",
          content: `Generate 5 multiple choice questions for this lesson:
            - Lesson Title: ${body.lesson_title}
            - Lesson Content: ${body.lesson_content}
            
            Return ONLY a valid JSON array like this:
            [
              {
                "question": "Question here?",
                "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
                "correct_answer": "Choice A",
                "explanation": "Brief explanation why this is correct"
              }
            ]`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const response = completion.choices[0].message.content;
    console.log("Groq quiz response:", response);

    const cleaned = response.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(cleaned);

    return NextResponse.json({ questions });

  } catch (error) {
    console.error("Quiz API Error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

