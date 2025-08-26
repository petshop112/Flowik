package fooTalent.flowik;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class FlowikApplication {

	public static void main(String[] args) {
		SpringApplication.run(FlowikApplication.class, args);
		System.out.println("Versión de Java en ejecución: " + Runtime.version());
	}
}