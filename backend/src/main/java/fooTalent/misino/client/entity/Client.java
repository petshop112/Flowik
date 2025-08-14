package fooTalent.misino.client.entity;


import fooTalent.misino.client.dto.ClientRegister;
import fooTalent.misino.client.dto.ClientUpdate;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name= "client")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id_client;

    @Column(nullable= false, length=100)
    private String name_client;

    @Column(nullable= false, length=50)
    private String document_type;

    @Column(nullable = false, length = 20)
    private long telephone_client;

    @Column(nullable = false, length = 150)
    private String direction_client;

    @Column(nullable = false, length = 150)
    private String emil_client;

    @Column(nullable = false,name = "dedb") //, precision = 10, scale = 2
    private int dedb_client;

    @Column(name = "ingress_date")
    @Temporal(TemporalType.DATE)
    private LocalDate ingress_date;

    @Column(name = "isactive")
    private boolean isactive;

    public Client(ClientRegister cr){
            this.name_client = cr.name_client();
            this.document_type = cr.document_type();
            this.telephone_client = cr.telephone_client();
            this.direction_client = cr.direction_provider();
            this.emil_client = cr.emil_client();
            this.dedb_client = cr.dedb_client();
            this.isactive = cr.isactive();
    }

    public void updateFromDto(ClientUpdate dto){
        if(dto.name_client() != null){
            this.name_client = dto.name_client();
        }
        if(dto.name_client() != null){
            this.document_type = dto.document_type();
        }
        if(dto.name_client() != null){
            this.telephone_client = dto.telephone_client();
        }
        if(dto.name_client() != null){
            this.direction_client = dto.direction_client();
        }
        if(dto.name_client() != null){
            this.emil_client = dto.emil_client();
        }
        if(dto.name_client() != null){
            this.dedb_client = dto.dedb_client();
        }
    }
}
