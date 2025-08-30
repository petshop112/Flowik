package fooTalent.flowik.products.services;

import fooTalent.flowik.exceptions.OpenAiQuotaExceededException;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.stereotype.Service;

@Service
public class OpenAiServiceWrapper {

    private final OpenAiChatModel chatModel;

    public OpenAiServiceWrapper(OpenAiChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String analizerProducts(String prompt) {
        var chatPrompt = new Prompt(prompt);

        try {
            var response = chatModel.call(chatPrompt);

            if (response.getResults().isEmpty() || response.getResults().get(0).getOutput() == null) {
                throw new IllegalStateException("La API no devolvió resultados, inténtalo de nuevo.");
            }

            return response.getResults().get(0).getOutput().getText();
        } catch (NonTransientAiException e) {
            throw new OpenAiQuotaExceededException("La cuota de OpenAI se agotó. Intenta más tarde.");
        } catch (Exception e) {
            throw new RuntimeException("Error al llamar a OpenAI: " + e.getMessage(), e);
        }
    }
}


