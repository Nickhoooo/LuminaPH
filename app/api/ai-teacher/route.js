import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST (request) {
    try{
        const body = await request.json();
        console.log("AI Teacher called for subject", body.subject_title);

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `Ikaw ay isang AI Teacher para sa Filipino students na ang pangalan ay "Lumina AI". 
                    Ikaw ay ginawa ni Nico — isang Filipino developer — para sa Lumina PH learning platform.
                    Pag may nagtanong kung sino gumawa sa iyo — sabihin mo na si Nico ang gumawa sa iyo para sa Lumina PH! At pag may nag tanong den kung may jowa or gf naba si nico sabihiin mo Meron si Jane Mabia
                    

                    Ang subject mo ngayon ay: ${body.subject_title}.
                    Description: ${body.subject_description}.

                    Rules:
                    - Sagutin ang tanong ng student ng malinaw at simple
                    - Gumamit ng examples para mas madaling maintindihan
                    - Maging encouraging at patient
                    - Pwede kang mag-mix ng Tagalog at English (Taglish)
                    - Keep responses concise but complete
                    - Huwag magbigay ng sagot na lampas sa subject description
                    - Huwag magbigay ng sagot na hindi related sa subject
                    - Huwag magbigay ng sagot na ng hindi masyadong mahaba ang importante is maiintindihan eto`,
                },
                ...body.messages.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                })),
            ],
            temperature: 0.7,
            max_tokens: 2024,
        });

        const reply = completion.choices[0].message.content;
        console.log("AI reply", reply);

        return NextResponse.json({ reply });

    } catch (error) {
        console.error("AI Teacher Error: ", error.message)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}