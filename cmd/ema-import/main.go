package main

import (
	"context"
	"flag"

	"github.com/nanozuki/crows.moe/cmd/ema-import/domain"
	"github.com/rs/zerolog/log"
)

const usage = `
Usage:
	ema-import -op import -input <input file path> [-apply]
	ema-import -op convert -2021 -input <input file path> -output <output file path>
`

var (
	op     string
	input  string
	output string
	apply  bool
	y2021  bool
)

func init() {
	flag.StringVar(&op, "op", "", "operation")
	flag.StringVar(&input, "input", "", "input file path")
	flag.StringVar(&output, "output", "", "output file path")
	flag.BoolVar(&apply, "apply", false, "apply changes to firestore")
	flag.BoolVar(&y2021, "2021", false, "import 2021 data")
}

func main() {
	flag.Parse()
	switch op {
	case "import":
		emaData, err := domain.NewEMADataFromFile(input)
		if err != nil {
			log.Fatal().Msg(err.Error())
		}
		importer := domain.NewImporter(!apply)
		ctx := context.Background()
		importer.ImportEMAData(ctx, emaData)
	case "convert":
		data2021, err := domain.NewData2021FromDirectory(input)
		if err != nil {
			log.Fatal().Msg(err.Error())
		}
		emaData, err := data2021.ToEMAData()
		if err != nil {
			log.Fatal().Msg(err.Error())
		}
		if err := emaData.SaveToFile(output); err != nil {
			log.Fatal().Msg(err.Error())
		}
	default:
		log.Fatal().Msg(usage)
	}
}
