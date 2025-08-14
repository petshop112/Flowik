package fooTalent.flowik.clientdedb.entity;


import fooTalent.flowik.clientdedb.dto.DedbUpdate;
import fooTalent.flowik.clientdedb.dto.Dedbregister;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter
@Entity
@Table(name = "dedb")
public class ClientDedb {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ingress_date")
    @Temporal(TemporalType.DATE)
    private Date dedb_date;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal dedb_client;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal mount;

    @Column(name = "isactive")
    private boolean isactive;

    public ClientDedb(Dedbregister dr){
        this.dedb_date = dr.dedb_date();
        this.dedb_client = dr.dedb_client();
        this.mount = dr.mount();
        this.isactive = dr.isactive();
    }
    public void updateFromdto(DedbUpdate du){
        if(du.dedb_client() != null){
            this.dedb_client = du.dedb_client();
        }
        if(du.mount() != null){
            this.mount = du.mount();;
        }
    }
}
