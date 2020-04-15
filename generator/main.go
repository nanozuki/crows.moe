package main

import (
	"bufio"
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

var filesPath string

func init() {
	flag.StringVar(&filesPath, "p", "", "path of all articles")
}

func exitOnErr(err error) {
	if err != nil {
		fmt.Println("generate error")
		fmt.Printf("%+v\n", err)
		os.Exit(1)
	}
}

func main() {
	flag.Parse()
	if filesPath == "" {
		exitOnErr(fmt.Errorf("you must specify the articles path"))
	}
	articlesFiles, err := filepath.Glob(filepath.Join(filesPath, "*.md"))
	exitOnErr(err)
	var metas []*Meta
	for _, af := range articlesFiles {
		meta, err := extrctFile(af)
		exitOnErr(err)
		fmt.Printf("meta of '%s': %+v", af, meta)
		if meta != nil {
			metas = append(metas, meta)
		}
	}
	exitOnErr(writeMeta(metas))
}

type Meta struct {
	File    string    `json:"file"`
	Title   string    `json:"title"`   // title: <title>
	Create  time.Time `json:"create"`  // create: 2006-01-02 15:04
	Publish time.Time `json:"publish"` // publish: 2006-01-02 15:04
	Tags    []string  `json:"tags"`    // tags: tag1,,tag2,,tag3
}

const boundary = "---"

func extrctFile(filename string) (*Meta, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, fmt.Errorf("open file '%s' error: %+v", filename, err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	isStart := false
	anyMeta := false
	meta := &Meta{}
	for scanner.Scan() {
		text := scanner.Text()
		switch {
		case !isStart && text == boundary:
			isStart = true
		case !isStart && text != boundary:
			return nil, nil
		case isStart && text == boundary && anyMeta:
			_, pureName := filepath.Split(filename)
			meta.File = pureName
			return meta, nil
		case isStart && text == boundary && !anyMeta:
			return nil, nil
		case isStart && text != boundary:
			ok, err := meta.ParseLine(text)
			if err != nil {
				return nil, err
			}
			anyMeta = anyMeta || ok
		}
	}
	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("read file '%s' error: %+v", filename, err)
	}
	return nil, nil
}

func parseMetaTime(s string) (time.Time, error) {
	return time.Parse("2006-01-02 15:04", s)
}

func (m *Meta) ParseLine(line string) (bool, error) {
	words := strings.SplitN(line, ":", 2)
	if len(words) != 2 {
		return false, fmt.Errorf("invalid meta line: %s", line)
	}
	key, value := words[0], words[1]
	value = strings.TrimSpace(value)
	var err error
	switch key {
	case "title":
		m.Title = value
	case "create":
		m.Create, err = parseMetaTime(value)
	case "publish":
		m.Publish, err = parseMetaTime(value)
	case "tags":
		m.Tags = strings.Split(value, ",,")
	case "default":
		return false, nil
	}
	return true, err
}

func writeMeta(metas []*Meta) error {
	name := filepath.Join(filesPath, "metas.js")
	file, err := os.OpenFile(name, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0666)
	if err != nil {
		return fmt.Errorf("open meta file error: %+v", err)
	}
	defer file.Close()
	metasJSON, _ := json.Marshal(metas)
	text := fmt.Sprintf("const metas = %s;\nexport { metas };", metasJSON)
	_, err = file.Write([]byte(text))
	if err != nil {
		return fmt.Errorf("write meta file error: %+v", err)
	}
	return nil
}
