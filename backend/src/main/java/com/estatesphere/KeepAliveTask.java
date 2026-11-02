package com.estatesphere;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@EnableScheduling
public class KeepAliveTask {

    // fixedRate = 600000 matlab har 10 minute me chalega
    @Scheduled(fixedRate = 600000) 
    public void pingSelf() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://courageous-education-production-0274.up.railway.app/"; 
            
            restTemplate.getForObject(url, String.class);
            System.out.println("Pinged self to stay awake! - App is online");
        } catch (Exception e) {
            System.out.println("Ping error (Ignore kar sakte ho): " + e.getMessage());
        }
    }
}
