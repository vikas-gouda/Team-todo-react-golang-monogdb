package main

import (
	"fmt"
	"github/vikas-gouda/todo-react-golang/middleware"
	"github/vikas-gouda/todo-react-golang/router"
	"log"
	"net/http"
)

func main() {
	r := router.Router()
	r.Use(middleware.CORS)
	fmt.Println("Starting the server on port 9000..")

	log.Fatal(http.ListenAndServe(":9000", r))

}
