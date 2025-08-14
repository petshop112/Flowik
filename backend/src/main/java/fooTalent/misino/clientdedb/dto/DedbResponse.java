package fooTalent.misino.clientdedb.dto;

import fooTalent.misino.clientdedb.entity.ClientDedb;

import java.math.BigDecimal;

public record DedbResponse(
        BigDecimal dedb_client,
        BigDecimal mount
)
{
    public DedbResponse(ClientDedb cd){this(
            (cd !=null)? cd.getMount():null,
            (cd !=null)? cd.getDedb_client():null
    );
    }
}