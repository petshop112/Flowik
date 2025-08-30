package fooTalent.flowik.products.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;

public class ProductValidationResponse {

    @JsonProperty("validos")
    private List<ValidProduct> valid;

    @JsonProperty("invalidos")
    private List<InvalidProduct> invalid;

    public List<ValidProduct> getValid() {
        return valid;
    }

    public void setValid(List<ValidProduct> valid) {
        this.valid = valid;
    }

    public List<InvalidProduct> getInvalid() {
        return invalid;
    }

    public void setInvalid(List<InvalidProduct> invalid) {
        this.invalid = invalid;
    }

    public static class ValidProduct {
        private String name;
        private String description;
        private String category;
        private Integer amount;
        private BigDecimal sellPrice;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public Integer getAmount() { return amount; }
        public void setAmount(Integer amount) { this.amount = amount; }

        public BigDecimal getSellPrice() { return sellPrice; }
        public void setSellPrice(BigDecimal sellPrice) { this.sellPrice = sellPrice; }
    }

    public static class InvalidProduct {
        private int row;
        private List<String> errors;

        public int getRow() { return row; }
        public void setRow(int row) { this.row = row; }

        public List<String> getErrors() { return errors; }
        public void setErrors(List<String> errors) { this.errors = errors; }
    }
}