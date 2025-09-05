package fooTalent.flowik.config;

import fooTalent.flowik.users.entity.User;
import fooTalent.flowik.users.repositories.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class SecurityUtil {

    public static String getAuthenticatedEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName() == null) {
            throw new RuntimeException("Usuario no autenticado.");
        }

        return auth.getName();
    }

    public static void validateUserAccess(UserRepository userRepository, Long requestedUserId) {
        String email = getAuthenticatedEmail();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        if (!currentUser.getId().equals(requestedUserId)) {
            throw new AccessDeniedException("No estás autorizado para acceder a los datos de otro usuario.");
        }
    }
}