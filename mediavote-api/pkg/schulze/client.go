package schulze

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/nanozuki/crows.moe/mediavote-api/pkg/terror"
	"github.com/rs/zerolog/log"
)

type Request struct {
	Payload []Ballot `json:"payload"`
}

type Ballot struct {
	ID    string `json:"id"`
	Votes []Vote `json:"votes"`
}

type Vote struct {
	ID      int `json:"id"`
	Ranking int `json:"ranking"`
}

type Response [][]int

const apiURL = "https://schwartz.wakare.dev"

func getComputeResult(ctx context.Context, request Request) (Response, error) {
	data, err := json.Marshal(request)
	if err != nil {
		panic(terror.FatalError("marshal request failed: %v", err))
	}
	log.Info().Msgf("compute result, request = %s", string(data))
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, apiURL, bytes.NewBuffer(data))
	if err != nil {
		return nil, terror.InternalError("create request faled: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, terror.InternalError("do request failed: %v", err)
	}
	if res.StatusCode != http.StatusOK {
		message, _ := io.ReadAll(res.Body)
		return nil, terror.InternalError("do request failed, status = %v: %v", res.StatusCode, string(message))
	}
	var response Response
	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		return nil, terror.InternalError("decode response failed: %v", err)
	}
	return response, nil
}
