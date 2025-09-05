package fooTalent.flowik.products.dto;

import java.util.List;

public record TableRowResponse(
        List<String> headers,
        List<List<String>> rows) {
}
