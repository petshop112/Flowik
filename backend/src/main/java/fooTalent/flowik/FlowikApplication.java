package fooTalent.flowik;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FlowikApplication {

	public static void main(String[] args) {
		SpringApplication.run(FlowikApplication.class, args);
		System.out.println("Versión de Java en ejecución: " + Runtime.version());
	}

}
