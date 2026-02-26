<h1>Inventar </h1>

<h2>Requirements:</h2>
<ul>
<li>Node.js (https://nodejs.org/)</li>
<li>npm (comes with Node.js)</li>
<li>Apache Maven</li>
<li>Java 21+</li>
<li>PostgreSQL</li>
<li>Curl</li>
<li>Git</li>
</ul>

<h2>Installation procedure</h2>
<h3>1. PostgreSQL</h3>
```sh
vatroslav@vatroslav:~ $ sudo apt install postgresql
Installing:
  postgresql

Installing dependencies:
  libcommon-sense-perl  libjson-xs-perl    libsensors5               postgresql-17             postgresql-common-dev
  libio-pty-perl        libllvm19          libtypes-serialiser-perl  postgresql-client-17      ssl-cert
  libipc-run-perl       libpq5             libxslt1.1                postgresql-client-common  sysstat
  libjson-perl          libsensors-config  libz3-4                   postgresql-common

Suggested packages:
  lm-sensors  postgresql-doc  postgresql-doc-17  isag

Summary:
  Upgrading: 0, Installing: 20, Removing: 0, Not Upgrading: 3
  Download size: 50.6 MB
  Space needed: 230 MB / 53.9 GB available

Continue? [Y/n] y
Get:1 http://deb.debian.org/debian trixie/main arm64 libjson-perl all 4.10000-1 [87.5 kB]
Get:2 http://deb.debian.org/debian trixie/main arm64 postgresql-client-common all 278 [47.1 kB]
Get:3 http://deb.debian.org/debian trixie/main arm64 libio-pty-perl arm64 1:1.20-1+b3 [34.0 kB]
Get:4 http://deb.debian.org/debian trixie/main arm64 libipc-run-perl all 20231003.0-2 [101 kB]
Get:5 http://deb.debian.org/debian trixie/main arm64 postgresql-common-dev all 278 [72.4 kB]
Get:6 http://deb.debian.org/debian trixie/main arm64 ssl-cert all 1.1.3 [16.8 kB]
Get:7 http://deb.debian.org/debian trixie/main arm64 postgresql-common all 278 [112 kB]
Get:8 http://deb.debian.org/debian trixie/main arm64 libcommon-sense-perl arm64 3.75-3+b5 [22.9 kB]
Get:9 http://deb.debian.org/debian trixie/main arm64 libtypes-serialiser-perl all 1.01-1 [12.2 kB]
Get:10 http://deb.debian.org/debian trixie/main arm64 libjson-xs-perl arm64 4.040-1~deb13u1 [89.4 kB]
Get:11 http://deb.debian.org/debian trixie/main arm64 libz3-4 arm64 4.13.3-1 [7,507 kB]
Get:12 http://deb.debian.org/debian trixie/main arm64 libllvm19 arm64 1:19.1.7-3+b1 [23.3 MB]
Get:13 http://deb.debian.org/debian-security trixie-security/main arm64 libpq5 arm64 17.8-0+deb13u1 [221 kB]
Get:14 http://deb.debian.org/debian trixie/main arm64 libsensors-config all 1:3.6.2-2 [16.2 kB]
Get:15 http://deb.debian.org/debian trixie/main arm64 libsensors5 arm64 1:3.6.2-2 [36.4 kB]
Get:16 http://deb.debian.org/debian trixie/main arm64 libxslt1.1 arm64 1.1.35-1.2+deb13u2 [222 kB]
Get:17 http://deb.debian.org/debian-security trixie-security/main arm64 postgresql-client-17 arm64 17.8-0+deb13u1 [1,993 kB]
Get:18 http://deb.debian.org/debian-security trixie-security/main arm64 postgresql-17 arm64 17.8-0+deb13u1 [16.1 MB]
Get:19 http://deb.debian.org/debian trixie/main arm64 postgresql all 17+278 [16.7 kB]
Get:20 http://deb.debian.org/debian trixie/main arm64 sysstat arm64 12.7.5-2+b2 [597 kB]
Fetched 50.6 MB in 8s (6,423 kB/s)
Preconfiguring packages ...
/var/cache/debconf/tmp.ci/postgresql.config.XoYemt: 12: pg_lsclusters: not found
Selecting previously unselected package libjson-perl.
(Reading database ... 86665 files and directories currently installed.)
Preparing to unpack .../00-libjson-perl_4.10000-1_all.deb ...
Unpacking libjson-perl (4.10000-1) ...
Selecting previously unselected package postgresql-client-common.
Preparing to unpack .../01-postgresql-client-common_278_all.deb ...
Unpacking postgresql-client-common (278) ...
Selecting previously unselected package libio-pty-perl.
Preparing to unpack .../02-libio-pty-perl_1%3a1.20-1+b3_arm64.deb ...
Unpacking libio-pty-perl (1:1.20-1+b3) ...
Selecting previously unselected package libipc-run-perl.
Preparing to unpack .../03-libipc-run-perl_20231003.0-2_all.deb ...
Unpacking libipc-run-perl (20231003.0-2) ...
Selecting previously unselected package postgresql-common-dev.
Preparing to unpack .../04-postgresql-common-dev_278_all.deb ...
Unpacking postgresql-common-dev (278) ...
Selecting previously unselected package ssl-cert.
Preparing to unpack .../05-ssl-cert_1.1.3_all.deb ...
Unpacking ssl-cert (1.1.3) ...
Selecting previously unselected package postgresql-common.
Preparing to unpack .../06-postgresql-common_278_all.deb ...
Adding 'diversion of /usr/bin/pg_config to /usr/bin/pg_config.libpq-dev by postgresql-common'
Unpacking postgresql-common (278) ...
Selecting previously unselected package libcommon-sense-perl:arm64.
Preparing to unpack .../07-libcommon-sense-perl_3.75-3+b5_arm64.deb ...
Unpacking libcommon-sense-perl:arm64 (3.75-3+b5) ...
Selecting previously unselected package libtypes-serialiser-perl.
Preparing to unpack .../08-libtypes-serialiser-perl_1.01-1_all.deb ...
Unpacking libtypes-serialiser-perl (1.01-1) ...
Selecting previously unselected package libjson-xs-perl.
Preparing to unpack .../09-libjson-xs-perl_4.040-1~deb13u1_arm64.deb ...
Unpacking libjson-xs-perl (4.040-1~deb13u1) ...
Selecting previously unselected package libz3-4:arm64.
Preparing to unpack .../10-libz3-4_4.13.3-1_arm64.deb ...
Unpacking libz3-4:arm64 (4.13.3-1) ...
Selecting previously unselected package libllvm19:arm64.
Preparing to unpack .../11-libllvm19_1%3a19.1.7-3+b1_arm64.deb ...
Unpacking libllvm19:arm64 (1:19.1.7-3+b1) ...
Selecting previously unselected package libpq5:arm64.
Preparing to unpack .../12-libpq5_17.8-0+deb13u1_arm64.deb ...
Unpacking libpq5:arm64 (17.8-0+deb13u1) ...
Selecting previously unselected package libsensors-config.
Preparing to unpack .../13-libsensors-config_1%3a3.6.2-2_all.deb ...
Unpacking libsensors-config (1:3.6.2-2) ...
Selecting previously unselected package libsensors5:arm64.
Preparing to unpack .../14-libsensors5_1%3a3.6.2-2_arm64.deb ...
Unpacking libsensors5:arm64 (1:3.6.2-2) ...
Selecting previously unselected package libxslt1.1:arm64.
Preparing to unpack .../15-libxslt1.1_1.1.35-1.2+deb13u2_arm64.deb ...
Unpacking libxslt1.1:arm64 (1.1.35-1.2+deb13u2) ...
Selecting previously unselected package postgresql-client-17.
Preparing to unpack .../16-postgresql-client-17_17.8-0+deb13u1_arm64.deb ...
Unpacking postgresql-client-17 (17.8-0+deb13u1) ...
Selecting previously unselected package postgresql-17.
Preparing to unpack .../17-postgresql-17_17.8-0+deb13u1_arm64.deb ...
Unpacking postgresql-17 (17.8-0+deb13u1) ...
Selecting previously unselected package postgresql.
Preparing to unpack .../18-postgresql_17+278_all.deb ...
Unpacking postgresql (17+278) ...
Selecting previously unselected package sysstat.
Preparing to unpack .../19-sysstat_12.7.5-2+b2_arm64.deb ...
Unpacking sysstat (12.7.5-2+b2) ...
Setting up postgresql-client-common (278) ...
Setting up libio-pty-perl (1:1.20-1+b3) ...
Setting up libsensors-config (1:3.6.2-2) ...
Setting up libpq5:arm64 (17.8-0+deb13u1) ...
Setting up libcommon-sense-perl:arm64 (3.75-3+b5) ...
Setting up libz3-4:arm64 (4.13.3-1) ...
Setting up ssl-cert (1.1.3) ...
Setting up libipc-run-perl (20231003.0-2) ...
Setting up libsensors5:arm64 (1:3.6.2-2) ...
Setting up libtypes-serialiser-perl (1.01-1) ...
Setting up libjson-perl (4.10000-1) ...
Setting up libxslt1.1:arm64 (1.1.35-1.2+deb13u2) ...
Setting up sysstat (12.7.5-2+b2) ...
Creating config file /etc/default/sysstat with new version
update-alternatives: using /usr/bin/sar.sysstat to provide /usr/bin/sar (sar) in auto mode
Created symlink '/etc/systemd/system/sysstat.service.wants/sysstat-collect.timer' → '/usr/lib/systemd/system/sysstat-collect.timer'.
Created symlink '/etc/systemd/system/sysstat.service.wants/sysstat-rotate.timer' → '/usr/lib/systemd/system/sysstat-rotate.timer'.
Created symlink '/etc/systemd/system/sysstat.service.wants/sysstat-summary.timer' → '/usr/lib/systemd/system/sysstat-summary.timer'.
Created symlink '/etc/systemd/system/multi-user.target.wants/sysstat.service' → '/usr/lib/systemd/system/sysstat.service'.
Setting up postgresql-common-dev (278) ...
Setting up libjson-xs-perl (4.040-1~deb13u1) ...
Setting up libllvm19:arm64 (1:19.1.7-3+b1) ...
Setting up postgresql-client-17 (17.8-0+deb13u1) ...
update-alternatives: using /usr/share/postgresql/17/man/man1/psql.1.gz to provide /usr/share/man/man1/psql.1.gz (psql.1.gz) in auto mode
Setting up postgresql-common (278) ...
Creating config file /etc/postgresql-common/createcluster.conf with new version
Building PostgreSQL dictionaries from installed myspell/hunspell packages...
Removing obsolete dictionary files:
Created symlink '/etc/systemd/system/multi-user.target.wants/postgresql.service' → '/usr/lib/systemd/system/postgresql.service'.
Setting up postgresql-17 (17.8-0+deb13u1) ...
Creating new PostgreSQL cluster 17/main ...
/usr/lib/postgresql/17/bin/initdb -D /var/lib/postgresql/17/main --auth-local peer --auth-host scram-sha-256 --no-instructions
The files belonging to this database system will be owned by user "postgres".
This user must also own the server process.

The database cluster will be initialized with locale "en_GB.UTF-8".
The default database encoding has accordingly been set to "UTF8".
The default text search configuration will be set to "english".

Data page checksums are disabled.

fixing permissions on existing directory /var/lib/postgresql/17/main ... ok
creating subdirectories ... ok
selecting dynamic shared memory implementation ... posix
selecting default "max_connections" ... 100
selecting default "shared_buffers" ... 128MB
selecting default time zone ... Europe/Zagreb
creating configuration files ... ok
running bootstrap script ... ok
performing post-bootstrap initialization ... ok
syncing data to disk ... ok
Setting up postgresql (17+278) ...
Processing triggers for man-db (2.13.1-1) ...
Processing triggers for libc-bin (2.41-12+rpt1+deb13u1) ...
```

```sh
vatroslav@vatroslav:~ $ sudo su postgres
postgres@vatroslav:/home/vatroslav$ createuser vatroslav -P --interactive
Enter password for new role:
Enter it again:
Shall the new role be a superuser? (y/n) y
postgres@vatroslav:/home/vatroslav$ exit
exit
```

```sh
vatroslav@vatroslav:~ $ createdb vatroslav -W
Password:
vatroslav@vatroslav:~ $ psql
psql (17.8 (Debian 17.8-0+deb13u1))
Type "help" for help.

vatroslav=# \connect vatroslav
You are now connected to database "vatroslav" as user "vatroslav".
vatroslav=# exit
vatroslav@vatroslav:~ $
```

<h3>2. Curl </h3>
```sh
vatroslav@vatroslav:~ $ curl --version
vatroslav@vatroslav:~ $ sudo apt install curl
```
```sh
vatroslav@vatroslav:~ $ curl --version
curl 8.14.1 (aarch64-unknown-linux-gnu) libcurl/8.14.1 OpenSSL/3.5.4 zlib/1.3.1 brotli/1.1.0 zstd/1.5.7 libidn2/2.3.8 libpsl/0.21.2 libssh2/1.11.1 nghttp2/1.64.0 nghttp3/1.8.0 librtmp/2.3 OpenLDAP/2.6.10
Release-Date: 2025-06-04, security patched: 8.14.1-2+deb13u2
Protocols: dict file ftp ftps gopher gophers http https imap imaps ipfs ipns ldap ldaps mqtt pop3 pop3s rtmp rtsp scp sftp smb smbs smtp smtps telnet tftp ws wss
Features: alt-svc AsynchDNS brotli GSS-API HSTS HTTP2 HTTP3 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM PSL SPNEGO SSL threadsafe TLS-SRP UnixSockets zstd
```

<h3>3. Java </h3>
```sh
vatroslav@vatroslav:~ $ curl -s "https://get.sdkman.io" | bash

                                -+syyyyyyys:
                            `/yho:`       -yd.
                         `/yh/`             +m.
                       .oho.                 hy                          .`
                     .sh/`                   :N`                `-/o`  `+dyyo:.
                   .yh:`                     `M-          `-/osysoym  :hs` `-+sys:      hhyssssssssy+
                 .sh:`                       `N:          ms/-``  yy.yh-      -hy.    `.N-````````+N.
               `od/`                         `N-       -/oM-      ddd+`     `sd:     hNNm        -N:
              :do`                           .M.       dMMM-     `ms.      /d+`     `NMMs       `do
            .yy-                             :N`    ```mMMM.      -      -hy.       /MMM:       yh
          `+d+`           `:/oo/`       `-/osyh/ossssssdNMM`           .sh:         yMMN`      /m.
         -dh-           :ymNMMMMy  `-/shmNm-`:N/-.``   `.sN            /N-         `NMMy      .m/
       `oNs`          -hysosmMMMMydmNmds+-.:ohm           :             sd`        :MMM/      yy
      .hN+           /d:    -MMMmhs/-.`   .MMMh   .ss+-                 `yy`       sMMN`     :N.
     :mN/           `N/     `o/-`         :MMMo   +MMMN-         .`      `ds       mMMh      do
    /NN/            `N+....--:/+oooosooo+:sMMM:   hMMMM:        `my       .m+     -MMM+     :N.
   /NMo              -+ooooo+/:-....`...:+hNMN.  `NMMMd`        .MM/       -m:    oMMN.     hs
  -NMd`                                    :mm   -MMMm- .s/     -MMm.       /m-   mMMd     -N.
 `mMM/                                      .-   /MMh. -dMo     -MMMy        od. .MMMs..---yh
 +MMM.                                           sNo`.sNMM+     :MMMM/        sh`+MMMNmNm+++-
 mMMM-                                           /--ohmMMM+     :MMMMm.       `hyymmmdddo
 MMMMh.                  ````                  `-+yy/`yMMM/     :MMMMMy       -sm:.``..-:-.`
 dMMMMmo-.``````..-:/osyhddddho.           `+shdh+.   hMMM:     :MmMMMM/   ./yy/` `:sys+/+sh/
 .dMMMMMMmdddddmmNMMMNNNNNMMMMMs           sNdo-      dMMM-  `-/yd/MMMMm-:sy+.   :hs-      /N`
  `/ymNNNNNNNmmdys+/::----/dMMm:          +m-         mMMM+ohmo/.` sMMMMdo-    .om:       `sh
     `.-----+/.`       `.-+hh/`         `od.          NMMNmds/     `mmy:`     +mMy      `:yy.
           /moyso+//+ossso:.           .yy`          `dy+:`         ..       :MMMN+---/oys:
         /+m:  `.-:::-`               /d+                                    +MMMMMMMNh:`
        +MN/                        -yh.                                     `+hddhy+.
       /MM+                       .sh:
      :NMo                      -sh/
     -NMs                    `/yy:
    .NMy                  `:sh+.
   `mMm`               ./yds-
  `dMMMmyo:-.````.-:oymNy:`
  +NMMMMMMMMMMMMMMMMms:`
    -+shmNMMMNmdy+:`


                                                                 Now attempting installation...


Looking for a previous installation of SDKMAN...
Looking for unzip...
Looking for zip...
Looking for tar...
Looking for curl...
Looking for sed...
Installing SDKMAN scripts...
Create distribution directories...
Getting available candidates...
Prime platform file...
Prime the config file...
Installing script cli archive...
* Downloading...
######################################################################## 100.0%
* Checking archive integrity...
* Extracting archive...
* Copying archive contents...
* Cleaning up...

Installing script cli archive...
* Downloading...
######################################################################## 100.0%
* Checking archive integrity...
* Extracting archive...
* Copying archive contents...
* Cleaning up...

Set version to 5.20.0 ...
Set native version to 0.7.21 ...
Attempt update of interactive bash profile on regular UNIX...
Added sdkman init snippet to /home/vatroslav/.bashrc
Attempt update of zsh profile...
Updated existing /home/vatroslav/.zshrc



All done!


You are subscribed to the STABLE channel.

Please open a new terminal, or run the following in the existing one:

    source "/home/vatroslav/.sdkman/bin/sdkman-init.sh"

Then issue the following command:

    sdk help

Enjoy!!!
```

```sh
vatroslav@vatroslav:~ $ sdk version
-bash: sdk: command not found
```

```sh
vatroslav@vatroslav:~ $ source "$HOME/.sdkman/bin/sdkman-init.sh"
```

```sh
vatroslav@vatroslav:~ $ sdk version

SDKMAN!
script: 5.20.0
native: 0.7.21 (linux aarch64)
```

```sh
vatroslav@vatroslav:~ $ sdk install java 21-tem

Downloading: java 21-tem

In progress...

################################################################################################################# 100.0%

Repackaging Java 21-tem...

Done repackaging...

Installing: java 21-tem
Done installing!


Setting java 21-tem as default.
```
```sh
vatroslav@vatroslav:~ $ java -version
openjdk version "21" 2023-09-19 LTS
OpenJDK Runtime Environment Temurin-21+35 (build 21+35-LTS)
OpenJDK 64-Bit Server VM Temurin-21+35 (build 21+35-LTS, mixed mode, sharing)
```

<h3>4. Apache Maven</h3>
```sh
vatroslav@vatroslav:~ $ mvn --version
-bash: mvn: command not found
```

```sh
vatroslav@vatroslav:~ $ sudo apt install maven
Installing:
  maven

Installing dependencies:
  ca-certificates-java         libcups2t64                            libmaven-resolver-java
  default-jre-headless         liberror-prone-java                    libmaven-shared-utils-java
  fontconfig-config            libfontconfig1                         libmaven3-core-java
  fonts-dejavu-core            libfreetype6                           libplexus-cipher-java
  fonts-dejavu-mono            libgeronimo-annotation-1.3-spec-java   libplexus-classworlds-java
  java-common                  libgeronimo-interceptor-3.0-spec-java  libplexus-component-annotations-java
  libaopalliance-java          libgraphite2-3                         libplexus-interpolation-java
  libapache-pom-java           libguava-java                          libplexus-sec-dispatcher-java
  libatinject-jsr330-api-java  libguice-java                          libplexus-utils2-java
  libavahi-client3             libharfbuzz0b                          libsisu-inject-java
  libcdi-api-java              libhttpclient-java                     libsisu-plexus-java
  libcommons-cli-java          libhttpcore-java                       libslf4j-java
  libcommons-codec-java        libjansi-java                          libwagon-file-java
  libcommons-io-java           libjsoup-java                          libwagon-http-java
  libcommons-lang3-java        libjsr305-java                         libwagon-provider-api-java
  libcommons-logging-java      liblcms2-2                             openjdk-21-jre-headless
  libcommons-parent-java       libmaven-parent-java

Suggested packages:
  default-jre                      liblog4j1.2-java    liblcms2-utils             fonts-dejavu-extra    fonts-indic
  libatinject-jsr330-api-java-doc  cups-common         liblogback-java            fonts-ipafont-gothic
  libel-api-java                   libasm-java         libplexus-utils2-java-doc  fonts-ipafont-mincho
  libavalon-framework-java         libjsoup-java-doc   junit4                     fonts-wqy-microhei
  libexcalibur-logkit-java         libjsr305-java-doc  testng                     | fonts-wqy-zenhei

Summary:
  Upgrading: 0, Installing: 51, Removing: 0, Not Upgrading: 3
  Download size: 55.7 MB
  Space needed: 229 MB / 53.0 GB available

Continue? [Y/n] y
Get:1 http://deb.debian.org/debian trixie/main arm64 ca-certificates-java all 20240118 [11.6 kB]
Get:2 http://deb.debian.org/debian trixie/main arm64 java-common all 0.76 [6,776 B]
Get:3 http://deb.debian.org/debian trixie/main arm64 liblcms2-2 arm64 2.16-2 [151 kB]
Get:4 http://deb.debian.org/debian-security trixie-security/main arm64 openjdk-21-jre-headless arm64 21.0.10+7-1~deb13u1 [40.7 MB]
Get:5 http://deb.debian.org/debian trixie/main arm64 default-jre-headless arm64 2:1.21-76 [3,192 B]
Get:6 http://deb.debian.org/debian trixie/main arm64 fonts-dejavu-mono all 2.37-8 [489 kB]
Get:7 http://deb.debian.org/debian trixie/main arm64 fonts-dejavu-core all 2.37-8 [840 kB]
Get:8 http://deb.debian.org/debian trixie/main arm64 fontconfig-config arm64 2.15.0-2.3 [318 kB]
Get:9 http://deb.debian.org/debian trixie/main arm64 libaopalliance-java all 20070526-7 [8,572 B]
Get:10 http://deb.debian.org/debian trixie/main arm64 libapache-pom-java all 33-2 [5,852 B]
Get:11 http://deb.debian.org/debian trixie/main arm64 libatinject-jsr330-api-java all 1.0+ds1-6 [5,112 B]
Get:12 http://deb.debian.org/debian trixie/main arm64 libavahi-client3 arm64 0.8-16 [46.7 kB]
Get:13 http://deb.debian.org/debian trixie/main arm64 libgeronimo-interceptor-3.0-spec-java all 1.0.1-5 [8,444 B]
Get:14 http://deb.debian.org/debian trixie/main arm64 libcdi-api-java all 1.2-4 [55.3 kB]
Get:15 http://deb.debian.org/debian trixie/main arm64 libcommons-cli-java all 1.6.0-1 [60.4 kB]
Get:16 http://deb.debian.org/debian trixie/main arm64 libcommons-parent-java all 56-1 [10.8 kB]
Get:17 http://deb.debian.org/debian trixie/main arm64 libcommons-codec-java all 1.18.0-1 [304 kB]
Get:18 http://deb.debian.org/debian trixie/main arm64 libcommons-io-java all 2.19.0-1 [524 kB]
Get:19 http://deb.debian.org/debian trixie/main arm64 libcommons-lang3-java all 3.17.0-1+deb13u1 [641 kB]
Get:20 http://deb.debian.org/debian trixie/main arm64 libcommons-logging-java all 1.3.0-2 [68.6 kB]
Get:21 http://deb.debian.org/debian trixie/main arm64 libcups2t64 arm64 2.4.10-3+deb13u2 [236 kB]
Get:22 http://deb.debian.org/debian trixie/main arm64 libjsr305-java all 0.1~+svn49-12 [26.6 kB]
Get:23 http://deb.debian.org/debian trixie/main arm64 libguava-java all 32.0.1-1 [2,708 kB]
Get:24 http://deb.debian.org/debian trixie/main arm64 liberror-prone-java all 2.18.0-1 [22.5 kB]
Get:25 http://deb.debian.org/debian trixie/main arm64 libfreetype6 arm64 2.13.3+dfsg-1 [422 kB]
Get:26 http://deb.debian.org/debian trixie/main arm64 libfontconfig1 arm64 2.15.0-2.3 [387 kB]
Get:27 http://deb.debian.org/debian trixie/main arm64 libgeronimo-annotation-1.3-spec-java all 1.3-1 [11.1 kB]
Get:28 http://deb.debian.org/debian trixie/main arm64 libgraphite2-3 arm64 1.3.14-2+b1 [70.4 kB]
Get:29 http://deb.debian.org/debian trixie/main arm64 libguice-java all 5.1.0-1 [932 kB]
Get:30 http://deb.debian.org/debian trixie/main arm64 libharfbuzz0b arm64 10.2.0-1+b1 [442 kB]
Get:31 http://deb.debian.org/debian trixie/main arm64 libhttpcore-java all 4.4.16-1 [636 kB]
Get:32 http://deb.debian.org/debian trixie/main arm64 libhttpclient-java all 4.5.14-1 [1,247 kB]
Get:33 http://deb.debian.org/debian trixie/main arm64 libjansi-java all 2.4.1-2 [100 kB]
Get:34 http://deb.debian.org/debian trixie/main arm64 libjsoup-java all 1.15.3-1 [431 kB]
Get:35 http://deb.debian.org/debian trixie/main arm64 libmaven-parent-java all 43-2 [6,252 B]
Get:36 http://deb.debian.org/debian trixie/main arm64 libplexus-utils2-java all 3.4.2-1 [258 kB]
Get:37 http://deb.debian.org/debian trixie/main arm64 libwagon-provider-api-java all 3.5.3-2 [48.3 kB]
Get:38 http://deb.debian.org/debian trixie/main arm64 libmaven-resolver-java all 1.9.22-1 [729 kB]
Get:39 http://deb.debian.org/debian trixie/main arm64 libslf4j-java all 1.7.32-2 [142 kB]
Get:40 http://deb.debian.org/debian trixie/main arm64 libmaven-shared-utils-java all 3.4.2-1 [137 kB]
Get:41 http://deb.debian.org/debian trixie/main arm64 libplexus-cipher-java all 2.0-1 [14.9 kB]
Get:42 http://deb.debian.org/debian trixie/main arm64 libplexus-classworlds-java all 2.7.0-1 [50.6 kB]
Get:43 http://deb.debian.org/debian trixie/main arm64 libplexus-component-annotations-java all 2.1.1-1 [7,660 B]
Get:44 http://deb.debian.org/debian trixie/main arm64 libplexus-interpolation-java all 1.27-1 [76.8 kB]
Get:45 http://deb.debian.org/debian trixie/main arm64 libplexus-sec-dispatcher-java all 2.0-3 [28.3 kB]
Get:46 http://deb.debian.org/debian trixie/main arm64 libsisu-inject-java all 0.3.5-1 [352 kB]
Get:47 http://deb.debian.org/debian trixie/main arm64 libsisu-plexus-java all 0.3.5-1 [183 kB]
Get:48 http://deb.debian.org/debian trixie/main arm64 libmaven3-core-java all 3.9.9-1 [1,661 kB]
Get:49 http://deb.debian.org/debian trixie/main arm64 libwagon-file-java all 3.5.3-2 [8,452 B]
Get:50 http://deb.debian.org/debian trixie/main arm64 libwagon-http-java all 3.5.3-2 [49.6 kB]
Get:51 http://deb.debian.org/debian trixie/main arm64 maven all 3.9.9-1 [19.7 kB]
Fetched 55.7 MB in 7s (8,420 kB/s)
Extracting templates from packages: 100%
Preconfiguring packages ...
Selecting previously unselected package ca-certificates-java.
(Reading database ... 89234 files and directories currently installed.)
Preparing to unpack .../00-ca-certificates-java_20240118_all.deb ...
Unpacking ca-certificates-java (20240118) ...
Selecting previously unselected package java-common.
Preparing to unpack .../01-java-common_0.76_all.deb ...
Unpacking java-common (0.76) ...
Selecting previously unselected package liblcms2-2:arm64.
Preparing to unpack .../02-liblcms2-2_2.16-2_arm64.deb ...
Unpacking liblcms2-2:arm64 (2.16-2) ...
Selecting previously unselected package openjdk-21-jre-headless:arm64.
Preparing to unpack .../03-openjdk-21-jre-headless_21.0.10+7-1~deb13u1_arm64.deb ...
Unpacking openjdk-21-jre-headless:arm64 (21.0.10+7-1~deb13u1) ...
Selecting previously unselected package default-jre-headless.
Preparing to unpack .../04-default-jre-headless_2%3a1.21-76_arm64.deb ...
Unpacking default-jre-headless (2:1.21-76) ...
Selecting previously unselected package fonts-dejavu-mono.
Preparing to unpack .../05-fonts-dejavu-mono_2.37-8_all.deb ...
Unpacking fonts-dejavu-mono (2.37-8) ...
Selecting previously unselected package fonts-dejavu-core.
Preparing to unpack .../06-fonts-dejavu-core_2.37-8_all.deb ...
Unpacking fonts-dejavu-core (2.37-8) ...
Selecting previously unselected package fontconfig-config.
Preparing to unpack .../07-fontconfig-config_2.15.0-2.3_arm64.deb ...
Unpacking fontconfig-config (2.15.0-2.3) ...
Selecting previously unselected package libaopalliance-java.
Preparing to unpack .../08-libaopalliance-java_20070526-7_all.deb ...
Unpacking libaopalliance-java (20070526-7) ...
Selecting previously unselected package libapache-pom-java.
Preparing to unpack .../09-libapache-pom-java_33-2_all.deb ...
Unpacking libapache-pom-java (33-2) ...
Selecting previously unselected package libatinject-jsr330-api-java.
Preparing to unpack .../10-libatinject-jsr330-api-java_1.0+ds1-6_all.deb ...
Unpacking libatinject-jsr330-api-java (1.0+ds1-6) ...
Selecting previously unselected package libavahi-client3:arm64.
Preparing to unpack .../11-libavahi-client3_0.8-16_arm64.deb ...
Unpacking libavahi-client3:arm64 (0.8-16) ...
Selecting previously unselected package libgeronimo-interceptor-3.0-spec-java.
Preparing to unpack .../12-libgeronimo-interceptor-3.0-spec-java_1.0.1-5_all.deb ...
Unpacking libgeronimo-interceptor-3.0-spec-java (1.0.1-5) ...
Selecting previously unselected package libcdi-api-java.
Preparing to unpack .../13-libcdi-api-java_1.2-4_all.deb ...
Unpacking libcdi-api-java (1.2-4) ...
Selecting previously unselected package libcommons-cli-java.
Preparing to unpack .../14-libcommons-cli-java_1.6.0-1_all.deb ...
Unpacking libcommons-cli-java (1.6.0-1) ...
Selecting previously unselected package libcommons-parent-java.
Preparing to unpack .../15-libcommons-parent-java_56-1_all.deb ...
Unpacking libcommons-parent-java (56-1) ...
Selecting previously unselected package libcommons-codec-java.
Preparing to unpack .../16-libcommons-codec-java_1.18.0-1_all.deb ...
Unpacking libcommons-codec-java (1.18.0-1) ...
Selecting previously unselected package libcommons-io-java.
Preparing to unpack .../17-libcommons-io-java_2.19.0-1_all.deb ...
Unpacking libcommons-io-java (2.19.0-1) ...
Selecting previously unselected package libcommons-lang3-java.
Preparing to unpack .../18-libcommons-lang3-java_3.17.0-1+deb13u1_all.deb ...
Unpacking libcommons-lang3-java (3.17.0-1+deb13u1) ...
Selecting previously unselected package libcommons-logging-java.
Preparing to unpack .../19-libcommons-logging-java_1.3.0-2_all.deb ...
Unpacking libcommons-logging-java (1.3.0-2) ...
Selecting previously unselected package libcups2t64:arm64.
Preparing to unpack .../20-libcups2t64_2.4.10-3+deb13u2_arm64.deb ...
Unpacking libcups2t64:arm64 (2.4.10-3+deb13u2) ...
Selecting previously unselected package libjsr305-java.
Preparing to unpack .../21-libjsr305-java_0.1~+svn49-12_all.deb ...
Unpacking libjsr305-java (0.1~+svn49-12) ...
Selecting previously unselected package libguava-java.
Preparing to unpack .../22-libguava-java_32.0.1-1_all.deb ...
Unpacking libguava-java (32.0.1-1) ...
Selecting previously unselected package liberror-prone-java.
Preparing to unpack .../23-liberror-prone-java_2.18.0-1_all.deb ...
Unpacking liberror-prone-java (2.18.0-1) ...
Selecting previously unselected package libfreetype6:arm64.
Preparing to unpack .../24-libfreetype6_2.13.3+dfsg-1_arm64.deb ...
Unpacking libfreetype6:arm64 (2.13.3+dfsg-1) ...
Selecting previously unselected package libfontconfig1:arm64.
Preparing to unpack .../25-libfontconfig1_2.15.0-2.3_arm64.deb ...
Unpacking libfontconfig1:arm64 (2.15.0-2.3) ...
Selecting previously unselected package libgeronimo-annotation-1.3-spec-java.
Preparing to unpack .../26-libgeronimo-annotation-1.3-spec-java_1.3-1_all.deb ...
Unpacking libgeronimo-annotation-1.3-spec-java (1.3-1) ...
Selecting previously unselected package libgraphite2-3:arm64.
Preparing to unpack .../27-libgraphite2-3_1.3.14-2+b1_arm64.deb ...
Unpacking libgraphite2-3:arm64 (1.3.14-2+b1) ...
Selecting previously unselected package libguice-java.
Preparing to unpack .../28-libguice-java_5.1.0-1_all.deb ...
Unpacking libguice-java (5.1.0-1) ...
Selecting previously unselected package libharfbuzz0b:arm64.
Preparing to unpack .../29-libharfbuzz0b_10.2.0-1+b1_arm64.deb ...
Unpacking libharfbuzz0b:arm64 (10.2.0-1+b1) ...
Selecting previously unselected package libhttpcore-java.
Preparing to unpack .../30-libhttpcore-java_4.4.16-1_all.deb ...
Unpacking libhttpcore-java (4.4.16-1) ...
Selecting previously unselected package libhttpclient-java.
Preparing to unpack .../31-libhttpclient-java_4.5.14-1_all.deb ...
Unpacking libhttpclient-java (4.5.14-1) ...
Selecting previously unselected package libjansi-java.
Preparing to unpack .../32-libjansi-java_2.4.1-2_all.deb ...
Unpacking libjansi-java (2.4.1-2) ...
Selecting previously unselected package libjsoup-java.
Preparing to unpack .../33-libjsoup-java_1.15.3-1_all.deb ...
Unpacking libjsoup-java (1.15.3-1) ...
Selecting previously unselected package libmaven-parent-java.
Preparing to unpack .../34-libmaven-parent-java_43-2_all.deb ...
Unpacking libmaven-parent-java (43-2) ...
Selecting previously unselected package libplexus-utils2-java.
Preparing to unpack .../35-libplexus-utils2-java_3.4.2-1_all.deb ...
Unpacking libplexus-utils2-java (3.4.2-1) ...
Selecting previously unselected package libwagon-provider-api-java.
Preparing to unpack .../36-libwagon-provider-api-java_3.5.3-2_all.deb ...
Unpacking libwagon-provider-api-java (3.5.3-2) ...
Selecting previously unselected package libmaven-resolver-java.
Preparing to unpack .../37-libmaven-resolver-java_1.9.22-1_all.deb ...
Unpacking libmaven-resolver-java (1.9.22-1) ...
Selecting previously unselected package libslf4j-java.
Preparing to unpack .../38-libslf4j-java_1.7.32-2_all.deb ...
Unpacking libslf4j-java (1.7.32-2) ...
Selecting previously unselected package libmaven-shared-utils-java.
Preparing to unpack .../39-libmaven-shared-utils-java_3.4.2-1_all.deb ...
Unpacking libmaven-shared-utils-java (3.4.2-1) ...
Selecting previously unselected package libplexus-cipher-java.
Preparing to unpack .../40-libplexus-cipher-java_2.0-1_all.deb ...
Unpacking libplexus-cipher-java (2.0-1) ...
Selecting previously unselected package libplexus-classworlds-java.
Preparing to unpack .../41-libplexus-classworlds-java_2.7.0-1_all.deb ...
Unpacking libplexus-classworlds-java (2.7.0-1) ...
Selecting previously unselected package libplexus-component-annotations-java.
Preparing to unpack .../42-libplexus-component-annotations-java_2.1.1-1_all.deb ...
Unpacking libplexus-component-annotations-java (2.1.1-1) ...
Selecting previously unselected package libplexus-interpolation-java.
Preparing to unpack .../43-libplexus-interpolation-java_1.27-1_all.deb ...
Unpacking libplexus-interpolation-java (1.27-1) ...
Selecting previously unselected package libplexus-sec-dispatcher-java.
Preparing to unpack .../44-libplexus-sec-dispatcher-java_2.0-3_all.deb ...
Unpacking libplexus-sec-dispatcher-java (2.0-3) ...
Selecting previously unselected package libsisu-inject-java.
Preparing to unpack .../45-libsisu-inject-java_0.3.5-1_all.deb ...
Unpacking libsisu-inject-java (0.3.5-1) ...
Selecting previously unselected package libsisu-plexus-java.
Preparing to unpack .../46-libsisu-plexus-java_0.3.5-1_all.deb ...
Unpacking libsisu-plexus-java (0.3.5-1) ...
Selecting previously unselected package libmaven3-core-java.
Preparing to unpack .../47-libmaven3-core-java_3.9.9-1_all.deb ...
Unpacking libmaven3-core-java (3.9.9-1) ...
Selecting previously unselected package libwagon-file-java.
Preparing to unpack .../48-libwagon-file-java_3.5.3-2_all.deb ...
Unpacking libwagon-file-java (3.5.3-2) ...
Selecting previously unselected package libwagon-http-java.
Preparing to unpack .../49-libwagon-http-java_3.5.3-2_all.deb ...
Unpacking libwagon-http-java (3.5.3-2) ...
Selecting previously unselected package maven.
Preparing to unpack .../50-maven_3.9.9-1_all.deb ...
Unpacking maven (3.9.9-1) ...
Setting up libgraphite2-3:arm64 (1.3.14-2+b1) ...
Setting up liblcms2-2:arm64 (2.16-2) ...
Setting up libslf4j-java (1.7.32-2) ...
Setting up libplexus-utils2-java (3.4.2-1) ...
Setting up libplexus-classworlds-java (2.7.0-1) ...
Setting up libjsr305-java (0.1~+svn49-12) ...
Setting up java-common (0.76) ...
Setting up libaopalliance-java (20070526-7) ...
Setting up libcommons-cli-java (1.6.0-1) ...
Setting up libplexus-component-annotations-java (2.1.1-1) ...
Setting up libgeronimo-annotation-1.3-spec-java (1.3-1) ...
Setting up libgeronimo-interceptor-3.0-spec-java (1.0.1-5) ...
Setting up libfreetype6:arm64 (2.13.3+dfsg-1) ...
Setting up libjansi-java (2.4.1-2) ...
Setting up libapache-pom-java (33-2) ...
Setting up libatinject-jsr330-api-java (1.0+ds1-6) ...
Setting up libplexus-interpolation-java (1.27-1) ...
Setting up fonts-dejavu-mono (2.37-8) ...
Setting up fonts-dejavu-core (2.37-8) ...
Setting up libjsoup-java (1.15.3-1) ...
Setting up libharfbuzz0b:arm64 (10.2.0-1+b1) ...
Setting up libhttpcore-java (4.4.16-1) ...
Setting up ca-certificates-java (20240118) ...
No JRE found. Skipping Java certificates setup.
Setting up libcdi-api-java (1.2-4) ...
Setting up libavahi-client3:arm64 (0.8-16) ...
Setting up libwagon-provider-api-java (3.5.3-2) ...
Setting up openjdk-21-jre-headless:arm64 (21.0.10+7-1~deb13u1) ...
update-alternatives: using /usr/lib/jvm/java-21-openjdk-arm64/bin/java to provide /usr/bin/java (java) in auto mode
update-alternatives: using /usr/lib/jvm/java-21-openjdk-arm64/bin/jpackage to provide /usr/bin/jpackage (jpackage) in auto mode
update-alternatives: using /usr/lib/jvm/java-21-openjdk-arm64/bin/keytool to provide /usr/bin/keytool (keytool) in auto mode
update-alternatives: using /usr/lib/jvm/java-21-openjdk-arm64/bin/rmiregistry to provide /usr/bin/rmiregistry (rmiregistry) in auto mode
update-alternatives: using /usr/lib/jvm/java-21-openjdk-arm64/lib/jexec to provide /usr/bin/jexec (jexec) in auto mode
Setting up fontconfig-config (2.15.0-2.3) ...
Setting up libmaven-parent-java (43-2) ...
Setting up libcommons-parent-java (56-1) ...
Setting up libcommons-logging-java (1.3.0-2) ...
Setting up libsisu-inject-java (0.3.5-1) ...
Setting up libplexus-cipher-java (2.0-1) ...
Setting up libsisu-plexus-java (0.3.5-1) ...
Setting up libcommons-lang3-java (3.17.0-1+deb13u1) ...
Setting up libplexus-sec-dispatcher-java (2.0-3) ...
Setting up libwagon-file-java (3.5.3-2) ...
Setting up libcommons-codec-java (1.18.0-1) ...
Setting up libcups2t64:arm64 (2.4.10-3+deb13u2) ...
Setting up libcommons-io-java (2.19.0-1) ...
Setting up libmaven-resolver-java (1.9.22-1) ...
Setting up libhttpclient-java (4.5.14-1) ...
Setting up libwagon-http-java (3.5.3-2) ...
Setting up libmaven-shared-utils-java (3.4.2-1) ...
Setting up libguava-java (32.0.1-1) ...
Setting up liberror-prone-java (2.18.0-1) ...
Setting up libguice-java (5.1.0-1) ...
Setting up libmaven3-core-java (3.9.9-1) ...
Processing triggers for libc-bin (2.41-12+rpt1+deb13u1) ...
Processing triggers for man-db (2.13.1-1) ...
Processing triggers for sgml-base (1.31+nmu1) ...
Setting up libfontconfig1:arm64 (2.15.0-2.3) ...
Processing triggers for ca-certificates-java (20240118) ...
Adding debian:ACCVRAIZ1.pem
Adding debian:AC_RAIZ_FNMT-RCM.pem
Adding debian:AC_RAIZ_FNMT-RCM_SERVIDORES_SEGUROS.pem
Adding debian:Actalis_Authentication_Root_CA.pem
Adding debian:AffirmTrust_Commercial.pem
Adding debian:AffirmTrust_Networking.pem
Adding debian:AffirmTrust_Premium_ECC.pem
Adding debian:AffirmTrust_Premium.pem
Adding debian:Amazon_Root_CA_1.pem
Adding debian:Amazon_Root_CA_2.pem
Adding debian:Amazon_Root_CA_3.pem
Adding debian:Amazon_Root_CA_4.pem
Adding debian:ANF_Secure_Server_Root_CA.pem
Adding debian:Atos_TrustedRoot_2011.pem
Adding debian:Atos_TrustedRoot_Root_CA_ECC_TLS_2021.pem
Adding debian:Atos_TrustedRoot_Root_CA_RSA_TLS_2021.pem
Adding debian:Autoridad_de_Certificacion_Firmaprofesional_CIF_A62634068.pem
Adding debian:Baltimore_CyberTrust_Root.pem
Adding debian:BJCA_Global_Root_CA1.pem
Adding debian:BJCA_Global_Root_CA2.pem
Adding debian:Buypass_Class_2_Root_CA.pem
Adding debian:Buypass_Class_3_Root_CA.pem
Adding debian:CA_Disig_Root_R2.pem
Adding debian:Certainly_Root_E1.pem
Adding debian:Certainly_Root_R1.pem
Adding debian:Certigna.pem
Adding debian:Certigna_Root_CA.pem
Adding debian:certSIGN_Root_CA_G2.pem
Adding debian:certSIGN_ROOT_CA.pem
Adding debian:Certum_EC-384_CA.pem
Adding debian:Certum_Trusted_Network_CA_2.pem
Adding debian:Certum_Trusted_Network_CA.pem
Adding debian:Certum_Trusted_Root_CA.pem
Adding debian:CFCA_EV_ROOT.pem
Adding debian:CommScope_Public_Trust_ECC_Root-01.pem
Adding debian:CommScope_Public_Trust_ECC_Root-02.pem
Adding debian:CommScope_Public_Trust_RSA_Root-01.pem
Adding debian:CommScope_Public_Trust_RSA_Root-02.pem
Adding debian:Comodo_AAA_Services_root.pem
Adding debian:COMODO_Certification_Authority.pem
Adding debian:COMODO_ECC_Certification_Authority.pem
Adding debian:COMODO_RSA_Certification_Authority.pem
Adding debian:DigiCert_Assured_ID_Root_CA.pem
Adding debian:DigiCert_Assured_ID_Root_G2.pem
Adding debian:DigiCert_Assured_ID_Root_G3.pem
Adding debian:DigiCert_Global_Root_CA.pem
Adding debian:DigiCert_Global_Root_G2.pem
Adding debian:DigiCert_Global_Root_G3.pem
Adding debian:DigiCert_High_Assurance_EV_Root_CA.pem
Adding debian:DigiCert_TLS_ECC_P384_Root_G5.pem
Adding debian:DigiCert_TLS_RSA4096_Root_G5.pem
Adding debian:DigiCert_Trusted_Root_G4.pem
Adding debian:D-TRUST_BR_Root_CA_1_2020.pem
Adding debian:D-TRUST_BR_Root_CA_2_2023.pem
Adding debian:D-TRUST_EV_Root_CA_1_2020.pem
Adding debian:D-TRUST_EV_Root_CA_2_2023.pem
Adding debian:D-TRUST_Root_Class_3_CA_2_2009.pem
Adding debian:D-TRUST_Root_Class_3_CA_2_EV_2009.pem
Adding debian:emSign_ECC_Root_CA_-_C3.pem
Adding debian:emSign_ECC_Root_CA_-_G3.pem
Adding debian:emSign_Root_CA_-_C1.pem
Adding debian:emSign_Root_CA_-_G1.pem
Adding debian:Entrust.net_Premium_2048_Secure_Server_CA.pem
Adding debian:Entrust_Root_Certification_Authority_-_EC1.pem
Adding debian:Entrust_Root_Certification_Authority_-_G2.pem
Adding debian:Entrust_Root_Certification_Authority.pem
Adding debian:ePKI_Root_Certification_Authority.pem
Adding debian:e-Szigno_Root_CA_2017.pem
Adding debian:FIRMAPROFESIONAL_CA_ROOT-A_WEB.pem
Adding debian:GDCA_TrustAUTH_R5_ROOT.pem
Adding debian:GlobalSign_ECC_Root_CA_-_R4.pem
Adding debian:GlobalSign_ECC_Root_CA_-_R5.pem
Adding debian:GlobalSign_Root_CA.pem
Adding debian:GlobalSign_Root_CA_-_R3.pem
Adding debian:GlobalSign_Root_CA_-_R6.pem
Adding debian:GlobalSign_Root_E46.pem
Adding debian:GlobalSign_Root_R46.pem
Adding debian:GLOBALTRUST_2020.pem
Adding debian:Go_Daddy_Class_2_CA.pem
Adding debian:Go_Daddy_Root_Certificate_Authority_-_G2.pem
Adding debian:GTS_Root_R1.pem
Adding debian:GTS_Root_R2.pem
Adding debian:GTS_Root_R3.pem
Adding debian:GTS_Root_R4.pem
Adding debian:HARICA_TLS_ECC_Root_CA_2021.pem
Adding debian:HARICA_TLS_RSA_Root_CA_2021.pem
Adding debian:Hellenic_Academic_and_Research_Institutions_ECC_RootCA_2015.pem
Adding debian:Hellenic_Academic_and_Research_Institutions_RootCA_2015.pem
Adding debian:HiPKI_Root_CA_-_G1.pem
Adding debian:Hongkong_Post_Root_CA_3.pem
Adding debian:IdenTrust_Commercial_Root_CA_1.pem
Adding debian:IdenTrust_Public_Sector_Root_CA_1.pem
Adding debian:ISRG_Root_X1.pem
Adding debian:ISRG_Root_X2.pem
Adding debian:Izenpe.com.pem
Adding debian:Microsec_e-Szigno_Root_CA_2009.pem
Adding debian:Microsoft_ECC_Root_Certificate_Authority_2017.pem
Adding debian:Microsoft_RSA_Root_Certificate_Authority_2017.pem
Adding debian:NAVER_Global_Root_Certification_Authority.pem
Adding debian:NetLock_Arany_=Class_Gold=_Főtanúsítvány.pem
Adding debian:OISTE_WISeKey_Global_Root_GB_CA.pem
Adding debian:OISTE_WISeKey_Global_Root_GC_CA.pem
Adding debian:QuoVadis_Root_CA_1_G3.pem
Adding debian:QuoVadis_Root_CA_2_G3.pem
Adding debian:QuoVadis_Root_CA_2.pem
Adding debian:QuoVadis_Root_CA_3_G3.pem
Adding debian:QuoVadis_Root_CA_3.pem
Adding debian:Sectigo_Public_Server_Authentication_Root_E46.pem
Adding debian:Sectigo_Public_Server_Authentication_Root_R46.pem
Adding debian:Secure_Global_CA.pem
Adding debian:SecureSign_Root_CA12.pem
Adding debian:SecureSign_Root_CA14.pem
Adding debian:SecureSign_Root_CA15.pem
Adding debian:SecureTrust_CA.pem
Adding debian:Security_Communication_ECC_RootCA1.pem
Adding debian:Security_Communication_RootCA2.pem
Adding debian:SSL.com_EV_Root_Certification_Authority_ECC.pem
Adding debian:SSL.com_EV_Root_Certification_Authority_RSA_R2.pem
Adding debian:SSL.com_Root_Certification_Authority_ECC.pem
Adding debian:SSL.com_Root_Certification_Authority_RSA.pem
Adding debian:SSL.com_TLS_ECC_Root_CA_2022.pem
Adding debian:SSL.com_TLS_RSA_Root_CA_2022.pem
Adding debian:Starfield_Class_2_CA.pem
Adding debian:Starfield_Root_Certificate_Authority_-_G2.pem
Adding debian:Starfield_Services_Root_Certificate_Authority_-_G2.pem
Adding debian:SwissSign_Gold_CA_-_G2.pem
Adding debian:SZAFIR_ROOT_CA2.pem
Adding debian:Telekom_Security_TLS_ECC_Root_2020.pem
Adding debian:Telekom_Security_TLS_RSA_Root_2023.pem
Adding debian:Telia_Root_CA_v2.pem
Adding debian:TeliaSonera_Root_CA_v1.pem
Adding debian:TrustAsia_Global_Root_CA_G3.pem
Adding debian:TrustAsia_Global_Root_CA_G4.pem
Adding debian:Trustwave_Global_Certification_Authority.pem
Adding debian:Trustwave_Global_ECC_P256_Certification_Authority.pem
Adding debian:Trustwave_Global_ECC_P384_Certification_Authority.pem
Adding debian:T-TeleSec_GlobalRoot_Class_2.pem
Adding debian:T-TeleSec_GlobalRoot_Class_3.pem
Adding debian:TUBITAK_Kamu_SM_SSL_Kok_Sertifikasi_-_Surum_1.pem
Adding debian:TunTrust_Root_CA.pem
Adding debian:TWCA_CYBER_Root_CA.pem
Adding debian:TWCA_Global_Root_CA.pem
Adding debian:TWCA_Root_Certification_Authority.pem
Adding debian:UCA_Extended_Validation_Root.pem
Adding debian:UCA_Global_G2_Root.pem
Adding debian:USERTrust_ECC_Certification_Authority.pem
Adding debian:USERTrust_RSA_Certification_Authority.pem
Adding debian:vTrus_ECC_Root_CA.pem
Adding debian:vTrus_Root_CA.pem
Adding debian:XRamp_Global_CA_Root.pem
done.
Setting up maven (3.9.9-1) ...
update-alternatives: using /usr/share/maven/bin/mvn to provide /usr/bin/mvn (mvn) in auto mode
Setting up default-jre-headless (2:1.21-76) ...
Processing triggers for libc-bin (2.41-12+rpt1+deb13u1) ...
```

```sh
vatroslav@vatroslav:~ $ mvn --version
Apache Maven 3.9.9
Maven home: /usr/share/maven
Java version: 21, vendor: Eclipse Adoptium, runtime: /home/vatroslav/.sdkman/candidates/java/21-tem
Default locale: en_GB, platform encoding: UTF-8
OS name: "linux", version: "6.12.47+rpt-rpi-v8", arch: "aarch64", family: "unix"
```

<h3>5. Git</h3>
```sh
vatroslav@vatroslav:~ $ git
-bash: git: command not found
```

```sh
vatroslav@vatroslav:~ $ sudo apt install git
Installing:
  git

Installing dependencies:
  git-man  liberror-perl

Suggested packages:
  git-doc  git-email  git-gui  gitk  gitweb  git-cvs  git-mediawiki  git-svn

Summary:
  Upgrading: 0, Installing: 3, Removing: 0, Not Upgrading: 3
  Download size: 10.9 MB
  Space needed: 53.1 MB / 52.6 GB available

Continue? [Y/n] y
Get:1 http://deb.debian.org/debian trixie/main arm64 liberror-perl all 0.17030-1 [26.9 kB]
Get:2 http://deb.debian.org/debian trixie/main arm64 git-man all 1:2.47.3-0+deb13u1 [2,205 kB]
Get:3 http://deb.debian.org/debian trixie/main arm64 git arm64 1:2.47.3-0+deb13u1 [8,666 kB]
Fetched 10.9 MB in 2s (6,164 kB/s)
Selecting previously unselected package liberror-perl.
(Reading database ... 90887 files and directories currently installed.)
Preparing to unpack .../liberror-perl_0.17030-1_all.deb ...
Unpacking liberror-perl (0.17030-1) ...
Selecting previously unselected package git-man.
Preparing to unpack .../git-man_1%3a2.47.3-0+deb13u1_all.deb ...
Unpacking git-man (1:2.47.3-0+deb13u1) ...
Selecting previously unselected package git.
Preparing to unpack .../git_1%3a2.47.3-0+deb13u1_arm64.deb ...
Unpacking git (1:2.47.3-0+deb13u1) ...
Setting up liberror-perl (0.17030-1) ...
Setting up git-man (1:2.47.3-0+deb13u1) ...
Setting up git (1:2.47.3-0+deb13u1) ...
Processing triggers for man-db (2.13.1-1) ...
```

```sh
vatroslav@vatroslav:~ $ git -v
git version 2.47.3
```

<h3>6. Node.js (npm)</h3>
```sh
vatroslav@vatroslav:~ $ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 16774  100 16774    0     0  87189      0 --:--:-- --:--:-- --:--:-- 87364
=> Downloading nvm as script to '/home/vatroslav/.nvm'

=> Appending nvm source string to /home/vatroslav/.bashrc
=> Appending bash_completion source string to /home/vatroslav/.bashrc
=> Close and reopen your terminal to start using nvm or run the following to use it now:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

```sh
vatroslav@vatroslav:~ $ \. "$HOME/.nvm/nvm.sh"
vatroslav@vatroslav:~ $ nvm install 24
Downloading and installing node v24.14.0...
Downloading https://nodejs.org/dist/v24.14.0/node-v24.14.0-linux-arm64.tar.xz...
################################################################################################################# 100.0%
Computing checksum with sha256sum
Checksums matched!
Now using node v24.14.0 (npm v11.9.0)
Creating default alias: default -> 24 (-> v24.14.0 *)
```

```sh
vatroslav@vatroslav:~ $ npm -v
11.9.0
```

<h2>Starting application procedure</h2>

<h3>1. Cloning Git repository</h3>
```sh
vatroslav@vatroslav:~ $ git clone https://github.com/ll54152/Vatroslav.git
Cloning into 'Vatroslav'...
remote: Enumerating objects: 1751, done.
remote: Counting objects: 100% (450/450), done.
remote: Compressing objects: 100% (267/267), done.
remote: Total 1751 (delta 242), reused 322 (delta 130), pack-reused 1301 (from 1)
Receiving objects: 100% (1751/1751), 800.56 KiB | 3.00 MiB/s, done.
Resolving deltas: 100% (780/780), done.
```

```sh
vatroslav@vatroslav:~/Vatroslav $ git checkout JWT
branch 'JWT' set up to track 'origin/JWT'.
Switched to a new branch 'JWT'
```

<h3>2. Starting backend</h3>
```sh
vatroslav@vatroslav:~/Vatroslav $ cd backend
vatroslav@vatroslav:~/Vatroslav/backend $ chmod +x mvnw
vatroslav@vatroslav:~/Vatroslav/backend $ ./mvnw spring-boot:run
```

<h3>3. Initializing frontend (Only when starting frontend for the first time)</h3>
```sh
vatroslav@vatroslav:~/Vatroslav $ cd frontend
vatroslav@vatroslav:~/Vatroslav/frontend $ npm install
```

<h3>4. Starting frontend</h3>
```sh
vatroslav@vatroslav:~/Vatroslav $ cd frontend
vatroslav@vatroslav:~/Vatroslav/frontend $ npm run dev -- --host

> react-baza@0.0.0 dev
> vite --host


  VITE v6.0.3  ready in 564 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://161.53.71.169:5173/
  ➜  press h + enter to show help
```