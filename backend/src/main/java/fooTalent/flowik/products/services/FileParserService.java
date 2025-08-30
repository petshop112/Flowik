package fooTalent.flowik.products.services;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import fooTalent.flowik.exceptions.util.FileParseException;
import fooTalent.flowik.products.dto.TableRowResponse;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.IntStream;

@Service
public class FileParserService {

    public TableRowResponse parseFile(MultipartFile documents) throws Exception {

        String filename = documents.getOriginalFilename();
        if (filename == null) throw new FileParseException("El archivo no es válido o está vacío");
        String lower = filename.toLowerCase(Locale.ROOT);

        if (lower.endsWith(".xlsx") || filename.endsWith(".xls")) {
            return parseExcel(documents.getInputStream());
        }
        if (lower.endsWith(".csv")) {
            return parseCsv(documents.getInputStream());
        }
        if (lower.endsWith(".pdf")) {
            return parsePdf(documents.getInputStream());
        } else {
            throw new FileParseException("Formato no soportado: " + filename);
        }
    }

    private TableRowResponse parseExcel(InputStream inputStream) throws IOException {
        try (Workbook workbook = WorkbookFactory.create(inputStream)) {
            Sheet sheet = workbook.getSheetAt(0);
            List<String> headers = new ArrayList<>();
            List<List<String>> rows = new ArrayList<>();
            boolean firstRow = true;
            for (Row row : sheet) {
                List<String> rowData = new ArrayList<>();
                for (Cell cell : row) {
                    rowData.add(getCellValue(cell));
                }
                if (firstRow) {
                    headers = rowData;
                    firstRow = false;
                } else {
                    rows.add(rowData);
                }
            }
            return new TableRowResponse(headers, rows);
        }
    }

    private TableRowResponse parseCsv(InputStream inputStream) throws IOException {
        List<String> headers = new ArrayList<>();
        List<List<String>> rows = new ArrayList<>();

        try (CSVReader reader = new CSVReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            String[] line;
            boolean firstRow = true;
            while ((line = reader.readNext()) != null) {
                if (firstRow) {
                    headers = Arrays.asList(line);
                    firstRow = false;
                } else {
                    rows.add(Arrays.asList(line));
                }
            }
        } catch (CsvValidationException e) {
            throw new FileParseException("Error al procesar el CSV", e);
        }
        return new TableRowResponse(headers, rows);
    }

    private TableRowResponse parsePdf(InputStream inputStream) throws IOException {
        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String rawText = stripper.getText(document);

            if (rawText == null || rawText.isBlank()) {
                throw new IllegalArgumentException("El PDF no contiene texto legible.");
            }

            String[] lines = rawText.replace("\u00A0", " ").split("\\r?\\n");
            List<String> headers = new ArrayList<>();
            List<List<String>> rows = new ArrayList<>();

            for (String line : lines) {
                if (line.isBlank()) continue;

                String[] parts = line.trim().split("(\\t|\\s{2,})");

                List<String> row = Arrays.stream(parts)
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .toList();

                if (row.isEmpty()) continue;
                rows.add(row);
            }

            if (rows.isEmpty()) {
                throw new IllegalArgumentException("No se detectaron filas en el PDF.");
            }

            int maxCols = rows.stream().mapToInt(List::size).max().orElse(1);
            if (rows.get(0).size() == maxCols) {
                headers = rows.remove(0);
            } else {
                headers = generateGenericHeaders(maxCols);
            }

            rows = normalizeRows(rows, maxCols);

            return new TableRowResponse(headers, rows);
        }
    }

    private List<String> generateGenericHeaders(int count) {
        return IntStream.range(0, count)
                .mapToObj(i -> "col" + (i + 1))
                .toList();
    }

    private List<List<String>> normalizeRows(List<List<String>> rows, int maxCols) {
        return rows.stream()
                .map(row -> {
                    List<String> normalized = new ArrayList<>(row);
                    while (normalized.size() < maxCols) normalized.add("");
                    return normalized;
                })
                .toList();
    }
    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getDateCellValue().toString();
                }
                yield String.valueOf(cell.getNumericCellValue());
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }
}