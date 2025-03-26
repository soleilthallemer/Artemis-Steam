# Use official Python image
FROM python:3.12

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the Flask port
EXPOSE 5000

# Use environment variables from .env
ENV FLASK_APP=wsgi.py
ENV FLASK_ENV=production
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=COSC3339%40Michaels
ENV MYSQL_DB=ArtemisAndSteam
ENV MYSQL_HOST=mysql
ENV MYSQL_PORT=3306

# Start the Flask application using Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "wsgi:app"]
