package fooTalent.misino.products.dto;

public record ProductUpdated(

        String title,
        Double price,
        String description,
        String category,
        String image
) {
}