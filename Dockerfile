# Use an official Python runtime as a parent image
FROM python:3.11

# Set the working directory to /clinicalx_main
WORKDIR /clinicalx_main/

# Copy the current directory contents into the container at /clinicalx_main
COPY . /clinicalx_main/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Install supervisord
RUN apt-get update && apt-get install -y supervisor

# Copy the supervisord.conf file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variable
ENV FLASK_APP=main.py

# Command to run supervisord
CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]