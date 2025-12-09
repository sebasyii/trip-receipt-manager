import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY || ''
});

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { image } = await request.json();

		if (!image) {
			return json({ success: false, error: 'No image provided' }, { status: 400 });
		}

		if (!OPENAI_API_KEY) {
			return json({ success: false, error: 'OpenAI API key not configured' }, { status: 500 });
		}

		// Call OpenAI GPT-4 Vision API
		const response = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: `Analyze this receipt image and extract the following information. Return ONLY valid JSON with no additional text:
{
  "date": "YYYY-MM-DD format",
  "amount": number (total amount as a number),
  "currency": "currency code (USD, EUR, etc.)",
  "description": "merchant name or brief description",
  "confidence": {
    "date": number between 0-1,
    "amount": number between 0-1,
    "currency": number between 0-1,
    "description": number between 0-1
  }
}

If you cannot determine a value with confidence, use null for that field and set confidence to 0.`
						},
						{
							type: 'image_url',
							image_url: {
								url: image
							}
						}
					]
				}
			],
			max_tokens: 500
		});

		const content = response.choices[0]?.message?.content;

		if (!content) {
			return json({ success: false, error: 'No response from AI' }, { status: 500 });
		}

		// Parse the JSON response
		let parsedData;
		try {
			// Remove any markdown code blocks if present
			const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
			parsedData = JSON.parse(cleanContent);
		} catch {
			console.error('Failed to parse AI response:', content);
			return json(
				{
					success: false,
					error: 'Failed to parse AI response'
				},
				{ status: 500 }
			);
		}

		return json({
			success: true,
			data: {
				date: parsedData.date || new Date().toISOString().split('T')[0],
				amount: parsedData.amount ?? null,
				currency: parsedData.currency || 'USD',
				description: parsedData.description || '',
				confidence: parsedData.confidence || {}
			}
		});
	} catch (error) {
		console.error('Error parsing receipt:', error);
		return json(
			{
				success: false,
				error: error instanceof Error ? error.message : 'Failed to parse receipt'
			},
			{ status: 500 }
		);
	}
};
