package com.estatesphere.controller;

import com.estatesphere.model.Inquiry;
import com.estatesphere.service.InquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    @Autowired
    private InquiryService inquiryService;

    @PostMapping
    public ResponseEntity<Inquiry> submitInquiry(@RequestBody Inquiry inquiry) {
        Inquiry saved = inquiryService.saveInquiry(inquiry);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public ResponseEntity<List<Inquiry>> getAllInquiries() {
        List<Inquiry> list = inquiryService.getAllInquiries();
        return ResponseEntity.ok(list);
    }
}
