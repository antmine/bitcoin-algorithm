#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "sha256.h"

char    *littleEndianConvert(char *param) {
    char *tmp;
    size_t sizeParam = strlen(param);

    if ((tmp = (char *)malloc(sizeParam + 1)) == NULL)
        return NULL;
    for (size_t i = 0; i < sizeParam - 1; i = i + 2) {
        tmp[i] = param[sizeParam - 1 - i - 1];
        tmp[i+1] = param[sizeParam - 1 - i];
    }
    tmp[sizeParam] = '\0';
    printf("test :%s\n", param);
    free(param);
    param = tmp;
    //printf("little :%s\n", param);
    return param;
}

char  *hexConvert(char *param){
    char *buf;
    size_t sz;

    printf("param = %s\n", param);
    sz = snprintf(NULL, 0, "test = %s\n", param);
    if ((buf = (char *)malloc(sz + 2)) != NULL) {
        snprintf(buf, sz+1, "%08x", atoi(param));
        buf[sz + 1] = '\0';
        printf("convert = %s\n\n", buf);
        return buf;
    }
    return NULL;
}

void   bitcoinWorker() {
    char version[] = "2";
    char *previousBlock;
    char *merkelRoot;
    char timeBlockMinning[] = "1418753140";
    char bits[] = "404454260";
    char nounce[] = "3225483075";
    char *littleVersion;
    char *littlePreviousBlock;
    char *littleMerkelRoot;
    char *littleTimeBlockMinning;
    char *littleBits;
    char *littlenounce;

    previousBlock = (char *)malloc(65);
    merkelRoot = (char *)malloc(65);
    snprintf(previousBlock, 65, "%s", "00000000000000000A2940884E0C3BC96510CAD11912A527E9D15DF42F0E1D67\0");
    snprintf(merkelRoot, 65, "%s",    "2E99F445C007A9158207CC30CEBAD2B3D26C45FDAB2EBDF50D261335FC00D92C\0");

    printf("%s\n", "yoyo");
    littleBits = hexConvert(&bits);
    littleTimeBlockMinning = hexConvert(&timeBlockMinning);
    littlenounce = hexConvert(&nounce);
    littleVersion = hexConvert(&version);

    printf("littleVersion :%s\n", littleEndianConvert(littleVersion));
    printf("littlePreviousBlock :%s\n", littleEndianConvert(previousBlock));
    printf("littleMerkelRoot :%s\n", littleEndianConvert(merkelRoot));
    printf("littleBits :%s\n", littleEndianConvert(littleBits));
    printf("littleTimeBlockMinning :%s\n",littleEndianConvert(littleTimeBlockMinning));
    printf("littlenounce :%s\n",littleEndianConvert(littlenounce));


}

int    main () {
    bitcoinWorker();
    return 0;
}
