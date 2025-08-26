package fooTalent.flowik.exceptions;

public class OpenAiQuotaExceededException extends RuntimeException {
  public OpenAiQuotaExceededException(String message) {
    super(message);
  }
}