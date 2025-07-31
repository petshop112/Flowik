package fooTalent.misino;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MisinoApplication {

	public static void main(String[] args) {
		SpringApplication.run(MisinoApplication.class, args);
		System.out.println("Versión de Java en ejecución: " + Runtime.version());
	}

}
