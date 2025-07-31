package fooTalent.misino.Auth.service;

import fooTalent.misino.Auth.dto.customUserDetails;
import fooTalent.misino.users.entity.user;
import fooTalent.misino.users.repositories.userRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class customUserDetailService implements UserDetailsService {

    private final userRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        user user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new customUserDetails(user);
    }
}
