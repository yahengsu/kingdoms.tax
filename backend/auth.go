package main

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt"
)

const AuthHeaderPrefix = "Bearer "

func validateToken(token string) bool {
	claims := jwt.StandardClaims{}
	accessToken, err := jwt.ParseWithClaims(token, &claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method")
		}
		return []byte(os.Getenv("JWT_SECRET_KEY")), nil
	})
	return err == nil && accessToken.Valid
}

func AuthenticateRoute(next func(http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Read the token from the request header
		tokens, ok := r.Header["Authorization"]
		if !ok || len(tokens) < 1 {
			http.Error(w, "Missing access token", http.StatusUnauthorized)
			return
		}

		// Trim and validate the token
		token := strings.TrimPrefix(tokens[0], AuthHeaderPrefix)
		if !validateToken(token) {
			http.Error(w, "Invalid access token", http.StatusUnauthorized)
			return
		}

		// Call the next handler if token is valid
		next(w, r)
	}
}
