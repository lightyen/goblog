package app

import (
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
)

type route struct {
	method  string
	path    string
	handler gin.HandlerFunc
}

func (a *App) addRoutes(prefix string, middlewares []gin.HandlerFunc, routes []route) {

	// parts := strings.FieldsFunc(prefix, func(c rune) bool { return c == '/' })

	// if len(parts) < 2 {
	// 	log.Panicf("invalid group prefix %s\n", prefix)
	// }

	// a.groupPrefix = append(a.groupPrefix, parts[0])

	g := a.router.Group(prefix, middlewares...)

	funcs := map[string]func(string, ...gin.HandlerFunc) gin.IRoutes{
		"GET":     g.GET,
		"POST":    g.POST,
		"PATCH":   g.PATCH,
		"PUT":     g.PUT,
		"DELETE":  g.DELETE,
		"OPTIONS": g.OPTIONS,
		"ANY":     g.Any,
	}

	for i := range routes {
		funcs[routes[i].method](routes[i].path, routes[i].handler)
	}
}

func (a *App) setStaticFileNoRoute(staticSrc string, middlewares ...gin.HandlerFunc) {
	if staticSrc != "" {
		staticSrc = filepath.Clean(staticSrc)
		fileinfo, err := os.Stat(staticSrc)
		if err != nil || !fileinfo.IsDir() {
			log.Errorf("set static web resource failed: %s", staticSrc)
		} else {
			a.renderSrc = staticSrc
			middlewares = append(middlewares, staticFilesMiddleware(staticSrc))
			a.router.NoRoute(middlewares...)
		}
	}
}

func (a *App) setGroupAPIRoutes(middlewares ...gin.HandlerFunc) {

	a.addRoutes("/token", middlewares, []route{
		{"POST", "/new", a.NewToken},
		{"GET", "/test", a.TestToken},
		{"GET", "/remove", a.RemoveToken},
	})

	a.addRoutes("/apis/v1", append(middlewares, validateTokenMiddleware(), testAPIMiddleware()), []route{
		{"GET", "/boxes", a.GetUsers},
		// {"GET", "/boxes/:id", a.GetUserByID},
		// {"POST", "/boxes", a.AddUser},
		// {"PATCH", "/boxes/:id", a.UpdateUser},
		// {"DELETE", "/boxes/:id", a.RemoveUser},
	})

}
