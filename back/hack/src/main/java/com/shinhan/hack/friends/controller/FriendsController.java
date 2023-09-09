package com.shinhan.hack.friends.controller;

import com.shinhan.hack.friends.dto.FriendsDto;
import com.shinhan.hack.friends.entity.Friends;
import com.shinhan.hack.friends.service.FriendsService;
import com.shinhan.hack.history.dto.HistoryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sshh/friends")
@RequiredArgsConstructor public class FriendsController {

    private final FriendsService friendsService;

    @GetMapping("/{studentid}")
    public ResponseEntity<List<FriendsDto>> getFriends(
            @PathVariable("studentid") Long studentid) {
        List<FriendsDto> friendsList= friendsService.getFriendsByStudent(studentid);
        return new ResponseEntity<>(friendsList, HttpStatus.OK);
    }

//    @PostMapping("/{studentid}/store/{friendStudentId}")
//    public ResponseEntity<List<FriendsDto>> saveFriend(
//            @PathVariable("studentid") Long studentid, @PathVariable("friendStudentId") Long friendStudentId) {
//        List<FriendsDto> friendsList= friendsService.saveFriend(studentid,friendStudentId );
//        return new ResponseEntity<>(friendsList, HttpStatus.OK);
//    }

}


//    @PostMapping("/{studentId}/store/{friendStudentId}")
//    public ResponseEntity<String> abc(@PathVariable("studentId") Long studentId, @PathVariable("friendStudentId") Long friendStudentId) {
//
//
//        friendsService.addFriend(studentId, friendStudentId, 1L);
//        return new ResponseEntity<>("Success", HttpStatus.OK);
//    }
//
//


//    @GetMapping("/history")
//    public ResponseEntity<List<HistoryDto.Response>> getAllHistory() {
//        List<HistoryDto.Response> responses = historyService.getAllHistory();
//        return new ResponseEntity<>(responses, HttpStatus.OK);
//    }
//}