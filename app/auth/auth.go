package auth

import (
	"time"

	jwt "github.com/dgrijalva/jwt-go"
)

// CookieName is Cookie Name
const CookieName string = "jwtToken"

const TimeoutSec int = 15

// SecretKey for json-web-token
const SecretKey string = "3whDNcB$b@XFDmDAcN74"

func GenerateToken() (string, error) {

	nowDate := time.Now()

	claims := make(jwt.MapClaims)
	claims["iss"] = "www.example.com"
	claims["sub"] = "userid"
	claims["iat"] = nowDate.Unix()                                              // RFC7519 Issued At
	claims["exp"] = nowDate.Add(time.Duration(TimeoutSec) * time.Second).Unix() // RFC7519 Expiration Time
	token := jwt.New(jwt.SigningMethodHS256)
	token.Claims = claims

	return token.SignedString([]byte(SecretKey))
}

func ParseToken(token string) (*jwt.Token, error) {
	t, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		return []byte(SecretKey), nil
	})
	return t, err
}
