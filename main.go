package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/gin-gonic/gin"
	jsoniter "github.com/json-iterator/go"
	log "github.com/sirupsen/logrus"
	cli "github.com/urfave/cli"

	"goblog/app"
)

var json = jsoniter.ConfigCompatibleWithStandardLibrary

var flags = []cli.Flag{
	cli.IntFlag{
		Name:   "port",
		Value:  8080,
		Usage:  "server will listen on this port",
		EnvVar: "GOBLOG_PORT",
	},
	cli.IntFlag{
		Name:   "tls-port",
		Value:  8081,
		Usage:  "server will listen on this tls port",
		EnvVar: "GOBLOG_TLS_PORT",
	},
	cli.StringFlag{
		Name:   "database-address",
		Value:  "127.0.0.1:27017",
		Usage:  "database address",
		EnvVar: "GOBLOG_DATABASE_ADDRESS",
	},
	cli.StringFlag{
		Name:   "database-username",
		Value:  "goblogya",
		Usage:  "username to login database",
		EnvVar: "GOBLOG_DATABASE_USERNAME",
	},
	cli.StringFlag{
		Name:   "database-password",
		Value:  "j^%;-fh=~-iwcc,2",
		Usage:  "password to login database",
		EnvVar: "GOBLOG_DATABASE_PASSWORD",
	},
	cli.StringFlag{
		Name:   "database-name",
		Value:  "goblog",
		Usage:  "the database name of goblog",
		EnvVar: "GOBLOG_DATABASENAME",
	},
	cli.StringFlag{
		Name:   "public",
		Usage:  "static public resource path",
		EnvVar: "GOBLOG_PUBLIC",
	},
	cli.BoolFlag{
		Name:   "debug",
		Usage:  "enable debug mode",
		EnvVar: "GOBLOG_DEBUG",
	},
	cli.StringFlag{
		Name:   "tls-crt",
		Usage:  "TLS certificate file",
		EnvVar: "GOBLOG_TLS_CERTIFICATE",
	},
	cli.StringFlag{
		Name:   "tls-key",
		Value:  "",
		Usage:  "TLS private key",
		EnvVar: "GOBLOG_TLS_KEY",
	},
}

func main() {
	var cliapp = cli.NewApp()
	cliapp.Name = "goblog"
	cliapp.Version = "1.0.0"
	cliapp.Usage = "blog system with golang web server"
	cliapp.UsageText = "goblog [OPTIONS]"
	cliapp.Copyright = "Copyright © 2018, xxxxxxxx"

	cliapp.Action = func(c *cli.Context) error {

		if c.GlobalIsSet("debug") {
			log.SetLevel(log.DebugLevel)
			gin.SetMode(gin.DebugMode)
		} else {
			log.SetLevel(log.ErrorLevel)
			gin.SetMode(gin.ReleaseMode)
		}

		stop := make(chan os.Signal)
		signal.Notify(stop, os.Interrupt, os.Kill, syscall.SIGTERM)

		a := app.New(c, stop)

		a.Run(c)

		<-stop
		fmt.Println("\nserver stop")

		return a.Stop()
	}
	cliapp.Flags = flags

	// Start ...
	cliapp.Run(os.Args)
}
