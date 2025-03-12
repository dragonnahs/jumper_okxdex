package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
)

type TokenResponse struct {
	Data []struct {
		ChainId             string `json:"chainId"`
		TokenContractAddress string `json:"tokenContractAddress"`
	} `json:"data"`
}

type Response struct {
	Success bool `json:"success"`
	Data    struct {
		ChainId      string `json:"chainId"`
		TokenAddress string `json:"tokenAddress"`
	} `json:"data,omitempty"`
	Error string `json:"error,omitempty"`
}

func main() {
	http.HandleFunc("/api/token", func(w http.ResponseWriter, r *http.Request) {
		// 设置CORS头
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "*")

		// 处理OPTIONS请求
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// 获取token地址参数
		tokenAddress := r.URL.Query().Get("address")
		if tokenAddress == "" {
			json.NewEncoder(w).Encode(Response{
				Success: false,
				Error:   "Token address is required",
			})
			return
		}

		// 请求OKX API
		url := "https://www.okx.com/priapi/v1/dx/market/v2/search?keyword=" + tokenAddress + "&chainId=all"
		resp, err := http.Get(url)
		if err != nil {
			json.NewEncoder(w).Encode(Response{
				Success: false,
				Error:   err.Error(),
			})
			return
		}
		defer resp.Body.Close()

		// 读取响应
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			json.NewEncoder(w).Encode(Response{
				Success: false,
				Error:   err.Error(),
			})
			return
		}

		// 解析OKX响应
		var tokenResp TokenResponse
		if err := json.Unmarshal(body, &tokenResp); err != nil {
			json.NewEncoder(w).Encode(Response{
				Success: false,
				Error:   err.Error(),
			})
			return
		}

		// 检查是否有数据
		if len(tokenResp.Data) == 0 {
			json.NewEncoder(w).Encode(Response{
				Success: false,
				Error:   "Token not found",
			})
			return
		}

		// 返回第一个匹配结果
		json.NewEncoder(w).Encode(Response{
			Success: true,
			Data: struct {
				ChainId      string `json:"chainId"`
				TokenAddress string `json:"tokenAddress"`
			}{
				ChainId:      tokenResp.Data[0].ChainId,
				TokenAddress: tokenResp.Data[0].TokenContractAddress,
			},
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Server starting on port %s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
} 