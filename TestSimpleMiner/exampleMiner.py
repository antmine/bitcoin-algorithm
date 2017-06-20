import hashlib, struct

ver = 2
prev_block = "000000000000000117c80378b8da0e33559b5997f2ad55e2f7d18ec1975b9717"
mrkl_root = "871714dcbae6c8193a2bb9b2a69fe1c0440399f38d94b3a0f1b447275a29978a"
time_ = 0x53058b35 # 2014-02-20 04:57:25
bits = 0x19015f53

# https://en.bitcoin.it/wiki/Difficulty
exp = bits >> 24
mant = bits & 0xffffff
target_hexstr = '%064x' % (mant * (1<<(8*(exp - 3))))
target_str = target_hexstr.decode('hex')
print target_str.encode('hex')
nonce = 856192328
while nonce < 0x100000000:
    header = ( struct.pack("<L", ver) + prev_block.decode('hex')[::-1] +
          mrkl_root.decode('hex')[::-1] + struct.pack("<LLL", time_, bits, nonce))
    print len(header)
    hash1 = hashlib.sha256(header).digest()
    print "hash1 = ", hash1[::-1].encode('hex');
    hash2 = hashlib.sha256(hash1).digest()
    print nonce, hash2[::-1].encode('hex')
    if hash2[::-1] < target_str:
        print 'success'
        break
    nonce += 1


# nounce : 856192328	hash : 0000000000000000e067a478024addfecdc93628978aa52d91fabd4292982a50
