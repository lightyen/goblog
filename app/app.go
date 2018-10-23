package app

import (
	"context"
	"crypto/tls"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	cli "github.com/urfave/cli"
)

// App main server app
type App struct {
	port    int
	tlsPort int
	// storage *storage.Storage
	router    *gin.Engine
	running   bool
	mutex     sync.Mutex
	server    *http.Server
	renderSrc string
	stop      chan os.Signal
}

// New create a new app
func New(c *cli.Context, stop chan os.Signal) *App {
	a := &App{
		port:    c.GlobalInt("port"),
		tlsPort: c.GlobalInt("tls-port"),
		router:  gin.New(),
		running: false,
		stop:    stop,
	}

	// setup the api routes
	a.setGroupAPIRoutes(recoverMiddleware())

	// setup for public static file routes
	staticSrc := c.GlobalString("public")
	if staticSrc != "" {
		a.setStaticFileNoRoute(staticSrc, recoverMiddleware())
	}

	// global
	a.router.Use(func(c *gin.Context) {
		// log.Println(c.Request.RemoteAddr)
		//t := time.Now()
		c.Next()
		//log.Print(time.Since(t))
	})

	return a
}

func sendFile(filename string, c *gin.Context) error {
	file, err := os.Open(filename)
	if err != nil {
		return fmt.Errorf("resource not found")
	}
	defer file.Close()
	info, _ := file.Stat()

	if info.IsDir() {
		return fmt.Errorf("resource not found")
	}

	extraHeaders := map[string]string{"Content-Disposition": fmt.Sprintf(`"attachment; filename="%s"`, filepath.Base(filename))}
	c.DataFromReader(http.StatusOK, info.Size(), "application/octet-stream", io.Reader(file), extraHeaders)

	return nil
}

// Run async start the server app
func (a *App) Run(c *cli.Context) {

	a.server = &http.Server{
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  120 * time.Second,
		Handler:      a.router,
	}

	certFile, keyFile := c.GlobalString("tls-crt"), c.GlobalString("tls-key")
	if certFile != "" && keyFile != "" {
		cer, err := tls.LoadX509KeyPair(certFile, keyFile)
		if err != nil {
			log.Errorf("LoadX509KeyPair: %s", err)
			return
		}
		a.server.TLSConfig = &tls.Config{Certificates: []tls.Certificate{cer}}
	}

	go func() {

		a.mutex.Lock()
		a.running = true
		a.mutex.Unlock()

		if a.server.TLSConfig != nil {

			// HTTP
			engine := gin.New()
			engine.Use(redirectHTTPSMiddleware(a.tlsPort))
			httpServer := &http.Server{
				Addr:         fmt.Sprintf(":%d", a.port),
				ReadTimeout:  10 * time.Second,
				WriteTimeout: 30 * time.Second,
				IdleTimeout:  120 * time.Second,
				Handler:      engine,
			}
			go func() {
				if gin.IsDebugging() {
					log.Printf("[GIN-debug] Listening and serving HTTP on %s", httpServer.Addr)
				}
				err := httpServer.ListenAndServe()
				if err != nil && err != http.ErrServerClosed {
					log.Errorf("ListenAndServe: %s", err)
					a.stop <- os.Interrupt
				}
			}()

			// HTTPS
			a.server.Addr = fmt.Sprintf(":%d", a.tlsPort)
			if gin.IsDebugging() {
				log.Printf("[GIN-debug] Listening and serving HTTPS on %s", a.server.Addr)
			}
			err := a.server.ListenAndServeTLS("", "")
			if err != nil && err != http.ErrServerClosed {
				log.Errorf("ListenAndServeTLS: %s", err)
				a.stop <- os.Interrupt
			}
		} else {
			a.server.Addr = fmt.Sprintf(":%d", a.port)
			if gin.IsDebugging() {
				log.Printf("[GIN-debug] Listening and serving HTTP on %s", a.server.Addr)
			}
			err := a.server.ListenAndServe()
			if err != nil && err != http.ErrServerClosed {
				log.Errorf("ListenAndServe: %s", err)
				a.stop <- os.Interrupt
			}
		}

		a.mutex.Lock()
		a.running = false
		a.mutex.Unlock()
	}()
}

// Stop stop the server app
func (a *App) Stop() error {

	a.mutex.Lock()
	defer a.mutex.Unlock()

	// defer a.storage.Close()

	if !a.running {

	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	a.running = false
	return a.server.Shutdown(ctx)
}
