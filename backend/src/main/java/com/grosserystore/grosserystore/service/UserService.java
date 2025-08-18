package com.grosserystore.grosserystore.service;

import com.grosserystore.grosserystore.entity.Cart;
import com.grosserystore.grosserystore.entity.User;
import com.grosserystore.grosserystore.repository.CartRepository;
import com.grosserystore.grosserystore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Transactional
    public User createUser(String username, String password, String email) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);

        user = userRepository.save(user);

        // Create cart for user
        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

        user.setCart(cart);
        return user;
    }

    public User login(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(user -> user.getPassword().equals(password))
                .orElse(null);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Transactional
    public User updateUser(Long id, String email) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null && email != null) {
            user.setEmail(email);
            return userRepository.save(user);
        }
        return null;
    }
}