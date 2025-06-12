package com.boot.z_config.mail.service;

import java.io.UnsupportedEncodingException;
import java.util.Random;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMessage.RecipientType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailServiceImpl implements MailService {

    @Autowired
    JavaMailSender emailsender; // Bean 등록해둔 MailConfig 를 emailsender 라는 이름으로 autowired

    private String ePw; // 인증번호

    // 메일 내용 작성
    @Override
    public MimeMessage createMessage(String to) throws MessagingException, UnsupportedEncodingException {
//      System.out.println("보내는 대상 : " + to);
//      System.out.println("인증 번호 : " + ePw);

        MimeMessage message = emailsender.createMimeMessage();

        message.addRecipients(RecipientType.TO, to);// 보내는 대상
        message.setSubject("Metro_House 회원가입 이메일 인증");// 제목

        String msgg = "";
        msgg += "<!DOCTYPE html>";
        msgg += "<html lang='ko'>";
        msgg += "<head>";
        msgg += "  <meta charset='UTF-8'>";
        msgg += "  <meta name='viewport' content='width=device-width, initial-scale=1.0'>";
        msgg += "  <title>메트로하우스 회원가입 인증</title>";
        msgg += "</head>";
        msgg += "<body style='margin: 0; padding: 0; font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; background-color: #f4f4f4;'>";
        msgg += "  <table role='presentation' cellspacing='0' cellpadding='0' border='0' align='center' width='100%' style='max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow:0 4px 8px rgba(0, 0, 0, 0.05); border: 1px solid lightgray;'>";
        msgg += "    <tr>";
        msgg += "      <td style='padding: 0 30px;'>";
        msgg += "        <div style='background-color: #f8f9fa; border-radius: 6px; padding: 30px; text-align: center; border-left: 4px solid #4A90E2;'>";
        msgg += "          <h3 style='color: #4A90E2; font-size: 18px; margin: 0 0 15px 0;'>회원가입 인증 코드입니다</h3>";
        msgg += "          <div style='font-size: 24px; letter-spacing: 2px; margin: 15px 0;'>";
        msgg += "            <strong style='color: #333333; background-color: #e9ecef; padding: 8px 15px; border-radius: 4px;'>" + ePw + "</strong>";
        msgg += "          </div>";
        msgg += "        </div>";
        msgg += "      </td>";
        msgg += "    </tr>";
        msgg += "  </table>";
        msgg += "</body>";
        msgg += "</html>";

        message.setText(msgg, "utf-8", "html");// 내용, charset 타입, subtype
        // 보내는 사람의 이메일 주소, 보내는 사람 이름
        message.setFrom(new InternetAddress("tjrdlchlrh00@naver.com", "test"));// 보내는 사람

        return message;
    }

    // 랜덤 인증 코드 전송
    @Override
    public String createKey() {
        StringBuffer key = new StringBuffer();
        Random rnd = new Random();

        for (int i = 0; i < 8; i++) { // 인증코드 8자리
            int index = rnd.nextInt(3); // 0~2 까지 랜덤, rnd 값에 따라서 아래 switch 문이 실행됨

            switch (index) {
                case 0:
                    key.append((char) ((int) (rnd.nextInt(26)) + 97));
                    // a~z (ex. 1+97=98 => (char)98 = 'b')
                    break;
                case 1:
                    key.append((char) ((int) (rnd.nextInt(26)) + 65));
                    // A~Z
                    break;
                case 2:
                    key.append((rnd.nextInt(10)));
                    // 0~9
                    break;
            }
        }

        return key.toString();
    }

    // 메일 발송
    // sendSimpleMessage 의 매개변수로 들어온 to 는 곧 이메일 주소가 되고,
    // MimeMessage 객체 안에 내가 전송할 메일의 내용을 담는다.
    // 그리고 bean 으로 등록해둔 javaMail 객체를 사용해서 이메일 send!!
    @Override
    public String sendSimpleMessage(String to) throws Exception {

        ePw = createKey(); // 랜덤 인증번호 생성

        // TODO Auto-generated method stub
        MimeMessage message = createMessage(to); // 메일 발송
        try {// 예외처리
            emailsender.send(message);
        } catch (MailException es) {
            es.printStackTrace();
            throw new IllegalArgumentException();
        }


        return ePw; // 메일로 보냈던 인증 코드를 서버로 반환
    }
}