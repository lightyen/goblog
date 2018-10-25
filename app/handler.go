package app

import (
	"fmt"
	"goblog/app/auth"
	"goblog/app/storage"
	"net/http"

	"github.com/gin-gonic/gin"
)

//GetUsers /apis/v1/boxes [GET]
func (a *App) GetUsers(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"data": "hello world"})
}

func (a *App) NewToken(c *gin.Context) {

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
		c.JSON(http.StatusInternalServerError, &gin.H{"result": false})
		fmt.Println("Error when signing the token")
		return
	}

	c.SetCookie(auth.CookieName, tokenString, auth.TimeoutSec+1, "/", "localhost", false, true)

	c.JSON(http.StatusOK, &gin.H{
		"result": true,
	})
}

func (a *App) TestToken(c *gin.Context) {

	tokenString, err := c.Cookie(auth.CookieName)

	_, err = auth.ParseToken(tokenString)

	if err != nil {
		c.JSON(http.StatusOK, &gin.H{
			"result": false,
		})
		return
	}

	c.JSON(http.StatusOK, &gin.H{
		"result": true,
	})
}

func (a *App) RemoveToken(c *gin.Context) {
	c.SetCookie(auth.CookieName, "", 0, "/", "localhost", false, true)
	c.JSON(http.StatusOK, &gin.H{
		"result": true,
	})
}
