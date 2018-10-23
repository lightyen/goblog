package app

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"

	"goblog/app/auth"
)

func recoverMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			panic := recover()
			if panic != nil {
				log.Debug("====== BEGIN PANIC ======")
				log.Debug(panic)
				for i := 3; ; i++ {
					_, file, line, ok := runtime.Caller(i)
					if !ok {
						break
					}
					log.Debugf("%s:%d", file, line)
				}
				log.Debug("====== END PANIC ========")

				//InternalServerErrorResp(c, fmt.Errorf("panic when deal with request [%s] %s", c.Request.Method, c.Request.URL), "")
			}
		}()
		c.Next()
	}
}

func testAPIMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// fmt.Println("Do something Before the API")
		c.Next()
		// fmt.Println("Do something After the API")
	}
}

func validateTokenMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := strings.TrimPrefix(c.GetHeader("Authorization"), "Bearer ")
		_, err := auth.ParseToken(tokenString)
		if err != nil {
			c.Abort()
			c.JSON(http.StatusUnauthorized, &gin.H{"message": fmt.Sprintf("%s", err)})
			return
		}

		c.Next()
	}
}

func staticFilesMiddleware(renderSrc string) gin.HandlerFunc {
	return func(c *gin.Context) {
		src := filepath.Join(renderSrc, c.Request.URL.Path)
		switch c.Request.URL.Path {
		case "/":
			c.File(src)
		case "/404":

			c.File(filepath.Join(renderSrc, "404.html"))

		default:
			fileInfo, err := os.Stat(src)
			if err != nil || fileInfo.IsDir() {
				c.Redirect(http.StatusMovedPermanently, "/404")
			} else {
				c.File(src)
			}
		}
		c.Next()
	}
}

func redirectHTTPSMiddleware(httpsPort int) gin.HandlerFunc {
	return func(c *gin.Context) {
		req := c.Request
		host := strings.Split(req.Host, ":")[0]
		target := fmt.Sprintf("https://%s:%d%s", host, httpsPort, req.URL.Path)
		if len(req.URL.RawQuery) > 0 {
			target += "?" + req.URL.RawQuery
		}
		log.Printf("redirect to: %s", target)
		http.Redirect(c.Writer, c.Request, target,
			http.StatusTemporaryRedirect)
	}
}
