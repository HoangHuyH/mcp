data "aws_ami" "amazon_linux_2" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "app" {
  ami           = data.aws_ami.amazon_linux_2.id
  instance_type = var.instance_type

  subnet_id                   = var.public_subnet_ids[0]
  vpc_security_group_ids      = [var.security_group_id]
  associate_public_ip_address = true
  key_name                   = var.key_name

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = base64encode(<<-EOF
    #!/bin/bash
    # Update system
    yum update -y
    yum install -y gcc-c++ make
    
    # Install Node.js 18
    curl -sL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs

    # Install Nginx
    amazon-linux-extras install nginx1 -y
    systemctl start nginx
    systemctl enable nginx

    # Install Git
    yum install -y git

    # Clone repository
    git clone https://github.com/HoangHuyH/mcp.git /var/www/mcp
    cd /var/www/mcp

    # Install dependencies and build
    npm install
    npm run build

    # Configure Nginx
    cat > /etc/nginx/conf.d/mcp.conf <<'EOL'
    server {
        listen 80;
        server_name _;
        root /var/www/mcp/dist;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /assets {
            expires 1y;
            add_header Cache-Control "public";
        }
    }
    EOL

    # Remove default nginx config
    rm -f /etc/nginx/conf.d/default.conf

    # Restart Nginx
    systemctl restart nginx

    # Set up automatic updates
    yum install -y yum-cron
    sed -i 's/apply_updates = no/apply_updates = yes/' /etc/yum/yum-cron.conf
    systemctl start yum-cron
    systemctl enable yum-cron
  EOF
  )

  tags = {
    Name        = "${var.project_name}-app"
    Environment = var.environment
  }

  lifecycle {
    create_before_destroy = true
  }
} 