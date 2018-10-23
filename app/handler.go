package app

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"

	"goblog/app/auth"
	"goblog/app/storage"
)

//GetUsers /apis/v1/boxes [GET]
func (s *App) GetUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"data": "hello world"})
}

type Token struct {
	TokenString string `json:"token"`
}

func (s *App) NewToken(c *gin.Context) {

	var user storage.User
	err := c.BindJSON(&user)
	if err != nil {
		fmt.Printf("json unmashal failed: %v", err)
		return
	}

	// if user.Username != "helloworld" || (user.Password != nil && *user.Password != "helloworld") {
	// 	c.JSON(http.StatusBadRequest, &gin.H{"messgae": "bad account"})
	// 	return
	// }

	tokenString, err := auth.GenerateToken()

	if err != nil {
		c.Status(http.StatusInternalServerError)
		fmt.Println("Error when signing the token")
		return
	}

	response := Token{tokenString}
	c.JSON(http.StatusOK, &response)
}

func (s *App) TestToken(c *gin.Context) {
	var tokenRequest Token

	var err error
	err = c.BindJSON(&tokenRequest)
	if err != nil {
		c.JSON(http.StatusUnauthorized, nil)
		fmt.Println("Error when test the token unmarshal")
		return
	}

	_, err = auth.ParseToken(tokenRequest.TokenString)

	if err != nil {
		c.JSON(http.StatusOK, &gin.H{
			"validated": false,
		})
		log.Printf("%s", err)
		return
	}

	c.JSON(http.StatusOK, &gin.H{
		"validated": true,
	})
}
