export const config = {
	appName:		"MON SITE WEB BACK",
	dbName:			"DB",
	mongHost: "localhost",
	environment:	process.env.NODE_ENV || "development",
	httpPort:		process.env.HTTP_PORT || 3040,
	httpsPort:		process.env.HTTPS_PORT || 3030,
	tokenExpires:	3600,								// Seconds
	minPwdLength:	6,
	maxAuthFails:	5
}

// member > user > admin
export const userLevels = {
	ADMIN:		"ADMIN",
	MANAGER:	"MANAGER",
	BASIC:		"BASIC"
};

