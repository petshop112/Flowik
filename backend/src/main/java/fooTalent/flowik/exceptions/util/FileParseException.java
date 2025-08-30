package fooTalent.flowik.exceptions.util;

public class FileParseException extends RuntimeException {
  public FileParseException(String message) {
    super(message);
  }
  public FileParseException(String message, Throwable cause) {
    super(message, cause);
  }
}