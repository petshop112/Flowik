package fooTalent.flowik.clientdedb.dto;

import fooTalent.flowik.clientdedb.entity.ClientDedb;

import java.math.BigDecimal;
import java.util.Date;

public record DedbList (
        Date dedb_date,
        BigDecimal dedb_client,
        BigDecimal mount,
        Boolean isactive
)
{
    public DedbList(ClientDedb cd){this(
            cd.getDedb_date(),
            cd.getMount(),
            cd.getDedb_client(),
            cd.isIsactive()
    );
    }
}
