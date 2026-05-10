.PHONY: deploy

deploy:
	bun run format
	bun run check
	bun test
	bun run build
	npm publish
