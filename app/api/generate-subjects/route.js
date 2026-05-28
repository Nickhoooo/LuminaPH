import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    console.log("GROQ API Key exists:", !!process.env.GROQ_API_KEY);

    const body = await request.json();
    console.log("Profile received:", body);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are an expert academic advisor for Filipino students. Always respond with valid JSON only, no markdown, no explanation.",
        },
        {
          role: "user",
          content: `Generate 5 personalized subjects for a student with this profile:
            - Name: ${body.name}
            - Course: ${body.course}
            - Year Level: ${body.year_level}
            - Education Level: ${body.education_level}
            - Learning Style: ${body.learning_style}
            - Age: ${body.age}
            
            Return ONLY a valid JSON array like this:
            [
              {
                "title": "Subject Name",
                "description": "Brief description of the subject",
                "difficulty_level": "basic"
              }
            ]`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response = completion.choices[0].message.content;
    console.log("Groq response:", response);

    const cleaned = response.replace(/```json|```/g, "").trim();
    const subjects = JSON.parse(cleaned);

    return NextResponse.json({ subjects });

  } catch (error) {
    console.error("API Error:", error.message);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}