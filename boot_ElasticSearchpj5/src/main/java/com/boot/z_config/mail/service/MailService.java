package com.boot.z_config.mail.service;

import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

public interface MailService {
    // MailService 클래스에서 구현하는 메서드들을 선언
    MimeMessage createMessage(String to) throws MessagingException, UnsupportedEncodingException;
    String createKey();
    String sendSimpleMessage(String to) throws Exception;
}