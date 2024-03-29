package com.shinhan.hack.history.service;


import com.shinhan.hack.history.dto.HistoryDto;
import com.shinhan.hack.history.dto.KakaoDocument;
import com.shinhan.hack.history.dto.KakaoLocalResponse;
import com.shinhan.hack.history.entity.History;
import com.shinhan.hack.history.repository.HistoryRepository;
import com.shinhan.hack.login.entity.Student;
import com.shinhan.hack.login.repository.LoginRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
public class HistoryService {
    private final HistoryRepository historyRepository;
    private final LoginRepository loginRepository;
    private static final String KAKAO_LOCAL_API_URL = "https://dapi.kakao.com/v2/local/search/keyword.json";
    @Value("${kakao.api.key}")
    private String KAKAO_API_KEY;


    public HistoryService(HistoryRepository historyRepository, LoginRepository loginRepository) {
        this.historyRepository = historyRepository;
        this.loginRepository = loginRepository;
    }
    public List<HistoryDto.Response> getAllHistory() {
        List<History> histories = historyRepository.findAll();
        return histories.stream()
                .map(this::Response1Dto)
                .collect(Collectors.toList());
    }

    public List<HistoryDto.Response> getMyHistory(Long studentId) {
        // long id로 객체 student 만들어서
        // student 객체로 탐색하기
        Student student = new Student();
        student.setStudentId(studentId);
        List<History> studentHistories = historyRepository.findByStudent(student);
        return studentHistories.stream()
                .map(this::ResponseDto)
                .collect(Collectors.toList());
    }
    public List<HistoryDto.Response> getHistoryData() {
        List<History> alltHistories = historyRepository.findAll();

        return alltHistories.stream()
                .map(this::ResponseDto)
                .collect(Collectors.toList());
    }

    public List<HistoryDto.Response> getHistoryMonth() {
        // 현재 - 한달 계산
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);

        // 한 달 거래내역 필터링
        List<History> allHistories = historyRepository.findAll();
        return allHistories.stream()
                .filter(history -> history.getTransactionTime().isAfter(oneMonthAgo))
                .map(this::ResponseDto)
                .collect(Collectors.toList());
    }


    public Map<Long, Map<String, HistoryDto.Summary>> getStatistics() {
        List<HistoryDto.Response> responses = getHistoryMonth();


        return responses.stream()
                .collect(
                        Collectors.groupingBy(
                                HistoryDto.Response::getStudentId,
                                Collectors.groupingBy(
                                        HistoryDto.Response::getContentCategory,
                                        Collector.of(
                                                () -> new long[2],
                                                (a, response) -> { a[0] += response.getPay(); a[1]++; },
                                                (a, b) -> { a[0] += b[0]; a[1] += b[1]; return a; },
                                                a -> new HistoryDto.Summary(a[0], a[1])
                                        )
                                )
                        )
                );
    }

    public HistoryDto.StatisticsSummary getStatisticsSummary() {
        Map<Long, Map<String, HistoryDto.Summary>> statistics = getStatistics();

        long grandTotalSum = 0;
        int studentCount = 0;

        for (Map.Entry<Long, Map<String, HistoryDto.Summary>> entry : statistics.entrySet()) {
            long totalSum = 0;
            long totalCount = 0;

            for (HistoryDto.Summary summary : entry.getValue().values()) {
                totalSum += summary.getSum();
                totalCount += summary.getCount();
            }

            grandTotalSum += totalSum;
            studentCount++;
        }

        double average = (double) grandTotalSum / studentCount;
        long roundedAverage = Math.round(average);
        HistoryDto.StatisticsSummary summary = new HistoryDto.StatisticsSummary();


        summary.setTotalSum(grandTotalSum);
        summary.setStudentCount(studentCount);
        summary.setAverage(roundedAverage);

        return summary;
    }


    public List<HistoryDto.DailyConsumptionDto> getMonthlyConsumption(Long studentId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneMonthAgo = now.minusMonths(1);

        List<Student> allStudents = loginRepository.findAll();

        List<History> allHistories = historyRepository.findAll();
        Map<String, LongSummaryStatistics> totalStats = allHistories.stream()
                .filter(history -> history.getTransactionTime().isAfter(oneMonthAgo))
                .collect(Collectors.groupingBy(
                        history -> history.getTransactionTime().toLocalDate().toString(),
                        Collectors.summarizingLong(History::getPay)
                ));

        Student student = new Student();
        student.setStudentId(studentId);

        List<History> studentHistories = historyRepository.findByStudent(student);
        Map<String, LongSummaryStatistics> myStats = studentHistories.stream()
                .filter(history -> history.getTransactionTime().isAfter(oneMonthAgo))
                .collect(Collectors.groupingBy(
                        history -> history.getTransactionTime().toLocalDate().toString(),
                        Collectors.summarizingLong(History::getPay)
                ));

        int totalStudentsCount = allStudents.size(); // 전체 학생 수


        List<HistoryDto.DailyConsumptionDto> result = new ArrayList<>();

        LocalDate currentDate = oneMonthAgo.toLocalDate();

        while (!currentDate.isAfter(now.toLocalDate())) {
            String dayString = currentDate.toString();
            long me = myStats.containsKey(dayString) ? myStats.get(dayString).getSum() : 0;
            long average =
                    Math.round(totalStats.containsKey(dayString) ? totalStats.get(dayString).getSum()/ totalStudentsCount : 0);
            result.add(new HistoryDto.DailyConsumptionDto(dayString, me, average));

            currentDate = currentDate.plusDays(1);
        }

        return result;
    }

    public void updateHistoryWithKakaoLocalAPI(History history) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "KakaoAK " + KAKAO_API_KEY);

        HttpEntity<String> entity = new HttpEntity<>("parameters", headers);

        ResponseEntity<KakaoLocalResponse> responseEntity =
                restTemplate.exchange(KAKAO_LOCAL_API_URL + "?query=" + history.getContent()+"건국대", HttpMethod.GET, entity, KakaoLocalResponse.class);

        if (responseEntity.getStatusCodeValue() == 200 && responseEntity.getBody() != null) {
            KakaoLocalResponse kakaoLocalResponse = responseEntity.getBody();

            // 응답 결과 중 첫 번째 항목을 선택 (다른 로직으로 변경 가능)
            if (!kakaoLocalResponse.getDocuments().isEmpty()) {
                KakaoDocument firstDocument = kakaoLocalResponse.getDocuments().get(0);
                System.out.println("firstDocument = " + firstDocument.getCategory());
                System.out.println("firstDocument = " + firstDocument.getAddressName());
                System.out.println("firstDocument = " + firstDocument.getY());
                System.out.println("firstDocument = " + firstDocument.getX());

                history.setContentCategory(firstDocument.getCategory());
                history.setLat(firstDocument.getY());
                history.setLon(firstDocument.getX());
                history.setAddress(firstDocument.getAddressName());

//                this.historyRepository.save(history);
            }
        }
    }








    private HistoryDto.Response ResponseDto(History history) {
        return HistoryDto.Response.builder()
                .historyId(history.getHistoryId())
                .studentId((history.getStudent().getStudentId()))
//                .student_id(history.getStudent_id())
                .content(history.getContent())
                .deposit(history.getDeposit())
                .pay(history.getPay())
                .transactionTime(history.getTransactionTime())
                .balance(history.getBalance())
                .contentCategory(history.getContentCategory())
                .imgUrl(history.getImgUrl())
                .day(history.getDay())
                .build();
    }
    private HistoryDto.Response Response1Dto(History history) {
        return HistoryDto.Response.builder()
                .historyId(history.getHistoryId())
                .studentId((history.getStudent().getStudentId()))
                .content(history.getContent())
                .deposit(history.getDeposit())
                .pay(history.getPay())
                .transactionTime(history.getTransactionTime())
                .balance(history.getBalance())
                .contentCategory(history.getContentCategory())
                .imgUrl(history.getImgUrl())
                .day(history.getDay())
                .lat(history.getLat())
                .lon(history.getLon())
                .userScore(history.getUserScore())
                .address(history.getAddress())
                .build();
    }


    }
