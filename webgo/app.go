package main

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/redis/go-redis/v9"
)

func main() {

	rdb := redis.NewClient(&redis.Options{
		Addr:     "redis:6379",
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/ping", func(c echo.Context) error {

		ctx := context.Background()

		val, err := rdb.Get(ctx, "ping").Result()
		var res string
		switch {
		case err == redis.Nil:
			res = "key does not exist"
		case err != nil:
			res = "Get failed"
		case val == "":
			res = "value is empty"
		default:
			res = val
		}
		fmt.Println(res)
		// http.DefaultTransport.RoundTrip(&http.Request{})
		return c.String(http.StatusOK, res)
	})
	e.POST("/ping", func(c echo.Context) error {

		ctx := context.Background()

		val, err := rdb.Set(ctx, "ping", "pong", 6*time.Second).Result()
		var res string
		switch {
		case err == redis.Nil:
			res = "key does not exist"
		case err != nil:
			res = "Set failed"
		case val == "":
			res = "value is empty"
		default:
			res = val
		}
		fmt.Println(res)

		// http.DefaultTransport.RoundTrip(&http.Request{})
		return c.String(http.StatusOK, res)
	})

	e.POST("/login", func(c echo.Context) error {

		u := new(struct {
			Name string `json:"name"`
			Code string `json:"code"`
		})
		if err := c.Bind(u); err != nil {
			return c.String(http.StatusBadRequest, "bad request")
		}
		return c.JSON(http.StatusOK, u)
	})

	e.Logger.Fatal(e.Start(":3000"))

}
