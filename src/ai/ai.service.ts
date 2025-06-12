import { Injectable, Logger } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async simulateResponse(
    text: string,
    aiTone: string = 'friendly',
  ): Promise<{ response: string; isAiGenerated: boolean }> {
    try {
      const prompt = `
Act as an Instagram content creator who responds to DMs in a ${aiTone} tone.
The incoming message was: "${text}"
Reply naturally, clearly, and in a way that feels human.
Include a link if it seems like a request for content.

Your response:
`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Using cheaper model to reduce quota usage
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 100,
      });

      const response =
        completion.choices[0].message.content ??
        'Lo siento, no pude generar una respuesta.';

      return { response, isAiGenerated: true };
    } catch (error) {
      this.logger.error('OpenAI API Error:', error.message);

      // Handle quota exceeded and other OpenAI errors
      if (error.status === 429) {
        this.logger.warn('OpenAI quota exceeded, using fallback response');
        return this.getFallbackResponse(text);
      }

      if (error.status === 401) {
        this.logger.error('OpenAI API key is invalid');
        return this.getFallbackResponse(text);
      }

      // For any other error, use fallback
      this.logger.error('Unexpected OpenAI error, using fallback response');
      return this.getFallbackResponse(text);
    }
  }

  private getFallbackResponse(text: string): {
    response: string;
    isAiGenerated: boolean;
  } {
    // Simple rule-based responses as fallback
    const lowerText = text.toLowerCase();

    if (
      lowerText.includes('hola') ||
      lowerText.includes('hi') ||
      lowerText.includes('hello')
    ) {
      return {
        response:
          '¡Hola! 👋 Gracias por escribirme. ¿En qué puedo ayudarte hoy?',
        isAiGenerated: false,
      };
    }

    if (
      lowerText.includes('precio') ||
      lowerText.includes('costo') ||
      lowerText.includes('cuánto')
    ) {
      return {
        response:
          '¡Hola! Me alegra que estés interesado/a. Te envío la información por DM para que puedas revisar todas las opciones disponibles. 📩',
        isAiGenerated: false,
      };
    }

    if (
      lowerText.includes('info') ||
      lowerText.includes('información') ||
      lowerText.includes('details')
    ) {
      return {
        response:
          '¡Perfecto! Te envío toda la información que necesitas. Si tienes alguna pregunta específica, no dudes en escribirme. 😊',
        isAiGenerated: false,
      };
    }

    if (
      lowerText.includes('gracias') ||
      lowerText.includes('thanks') ||
      lowerText.includes('thank you')
    ) {
      return {
        response:
          '¡De nada! 😊 Estoy aquí para ayudarte con lo que necesites. ¡Que tengas un excelente día!',
        isAiGenerated: false,
      };
    }

    // Default fallback response
    return {
      response:
        '¡Hola! Gracias por tu mensaje. En este momento estoy experimentando algunos problemas técnicos, pero te responderé personalmente muy pronto. ¡Gracias por tu paciencia! 😊',
      isAiGenerated: false,
    };
  }
}
